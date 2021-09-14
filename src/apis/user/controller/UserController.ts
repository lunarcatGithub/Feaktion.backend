import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import UserInterface from '../interfaces' 
import UserService from '../services'
import { nullStringSafe  } from '../../../lib/nullSafeChecker'
import { NotFoundError, AlreadyExistError, ValidationFailError } from '../../../lib/customErrorClass'
import { parseIntParam } from '../../../lib/parseParams'
import { generateToken } from '../../../lib/tokenManager'

// 회원가입
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { 
        id,
        email,
        password, 
        nickname, 
        sex,  
        agree_info,
    agree_service
    } = req.body
    
    try {
        const salt = await parseIntParam(nullStringSafe(process.env.HASH_SALT), 10)
        const encryptedPassword = await bcrypt.hash(password, salt)
        const data: UserInterface.userSignup = {
            id,
            email,
            password: encryptedPassword,
            nickname,
            sex,
        }

        const user = await UserService.createUser(data)
        await UserService.agreement(user.user_id, agree_info === 'true', agree_service === 'true')
        res.status(201).json({
            result: true,
            message: 'success'
        })
    } catch(err) {
        next(err)
    }
}

// 로그인
export const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body

    try {
        const check_user = await UserService.isExistUser(email)
        if (!check_user) throw new NotFoundError()

        const isCorrectPassword: boolean = await bcrypt.compare(password, check_user.password)
        if (!isCorrectPassword) throw new ValidationFailError()

        const token: string = await generateToken(email, check_user.nickname, check_user.user_id)
        res.cookie('feaktion_token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        })
        res.status(201).json({
            result: true,
            message: 'success',
            token,
        })

    } catch(err) {
        next(err)
    }
}

export const isExistId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body
        const foundUser = await UserService.isExistUser(email)
        if(foundUser) throw new AlreadyExistError()
    
        res.status(200).json({
            result: true,
            message: '사용가능한 email 입니다.'
        })
    } catch(err) {
        next(err)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { password } = req.body
        const { user_id, email } = res.locals.userInfo
        const check_user = await UserService.isExistUser(email)
        if (!check_user) throw new NotFoundError()

        const isCorrectPassword: boolean = await bcrypt.compare(password, check_user.password)
        if (!isCorrectPassword) throw new ValidationFailError()
        await UserService.deleteUser(user_id)
        res.status(200).json({
            result: true,
            message: '삭제완료',
        })
    } catch(err) {
        next(err)
    }
}