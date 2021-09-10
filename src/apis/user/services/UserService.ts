import { userSignup } from '../interfaces/user'
import { PrismaClient } from '@prisma/client'
import { feaktion_user } from '.prisma/client'


const prisma = new PrismaClient()

export const createUser = async(data: userSignup): Promise<feaktion_user | null> => {
    const user = await prisma.feaktion_user.create({
        data : {
            id: data.id,
            email: data.email,
            password: data.password,
            nickname: data.nickname,
            sex: data.sex,
            agree_info: data.agree_info,
            agree_service: data.agree_service,
        }
    })
    return user
}

export const isExistUser = async (email: string): Promise<feaktion_user | null> => {
    const result = await prisma.feaktion_user.findFirst({
        where : {
            email
        }
    })

    return result
}

export const deleteUser = async (user_id: number): Promise<feaktion_user | null> => {
    const result = await prisma.feaktion_user.delete({
        where: {
            user_id
        }
    })

    return result
}