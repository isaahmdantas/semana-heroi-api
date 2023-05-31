import { ICreate  } from "../interfaces/SchedulesInterface";
import { SchedulesRepository } from "../repositories/SchedulesRepository";
import { getHours, isBefore, startOfHour } from "date-fns";

class SchedulesServices {
    private schedulesRepository: SchedulesRepository;

    constructor(){
        this.schedulesRepository = new SchedulesRepository()
    }

    async create({ name, phone, date, user_id }: ICreate){
        const dateFormatted = new Date(date);
                
        const hourStart = startOfHour(dateFormatted);

        const hour = getHours(hourStart);

        if(hour <= 9 || hour >= 12){
            throw new Error('Create Schedule  between 9 and 19.');
        }

        if (isBefore(hourStart, new Date())) {
            throw new Error('It is not allowed to schedule old date.');
        }

        const checkIsAvailable = await this.schedulesRepository.findByDate(hourStart, user_id);
        if (checkIsAvailable) {
            throw new Error('Schedule date is not available.');
        }

        const create = await this.schedulesRepository.create({ name, phone, date: hourStart, user_id });

        return create;
    }

    async index(date: Date) {
        const result = await this.schedulesRepository.findAllDate(date);

        return result;
    }

    async update(id: string, date: Date, user_id: string) {
        const dateFormatted = new Date(date);
        const hourStart = startOfHour(dateFormatted);

        if (isBefore(hourStart, new Date())) {
            throw new Error('It is not allowed to schedule old date.');
        }

        const checkIsAvailable = await this.schedulesRepository.findByDate(hourStart, user_id);
        if (checkIsAvailable) {
            throw new Error('Schedule date is not available.');
        }

        const result = await this.schedulesRepository.update(id, date);

        return result;

    }

    async delete() {
        
    }
}

export { SchedulesServices }