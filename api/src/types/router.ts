import type { FastifyReply, RawServerBase, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGenericInterface, ContextConfigDefault, FastifySchema, FastifyTypeProviderDefault, FastifyRequest } from 'fastify'
import type { ZodError } from 'zod'

// Enum para os tipos de método
export enum MethodType {
    Get = 'Get',
    Post = 'Post',
    Put = 'Put',
    Delete = 'Delete',
    Websocket = 'Websocket'
}

// Definindo a estrutura de resposta de lista com tipo genérico T
export type ListResponse<T> = {
    data: T[]
    total: number
    currentPage: number
    totalPages: number
    pageSize: number
}

// Resposta de erro comum
export type TErrorResponse = {
    message: string
    toastMessage?: string
}

// Estrutura base para respostas de sucesso, com tipo genérico TData
export type TReplySuccessBase<TData> = {
    message: string
    data?: TData
}

// Respostas para códigos de erro padrão
export type TReplyDefault = {
    [Status in 400 | 401 | 403 | 404 | 422 | 500]: TErrorResponse
}

// Tipo genérico de resposta com status diferentes
export type TReply<TData> = {
    200: TReplySuccessBase<TData> | ListResponse<TData>
    201: TReplySuccessBase<TData>
    302: {
        url: string
        message: string
        shouldRedirect?: boolean
    }
    400: {
        message: string
        zodError: ZodError
    }
} & TReplyDefault

// Extensão de resposta com mensagem de toast opcional
export type TReplyWithToastMessage<TData> = {
    [StatusCode in keyof TReply<TData>]: TReply<TData>[StatusCode] & {
        toastMessage?: string
    }
}

// Mapeia as chaves para os códigos de resposta
type ReplyKeysToCodes = keyof TReply<unknown>

// Tipo do método do aplicativo, com código de status específico
export type MethodApp<Code extends ReplyKeysToCodes = keyof TReply<unknown>> = {
    type: MethodType
    authenticate?: ('bearer')[]
    run: (request: FastifyRequest, reply: ReplyType<Code>) => Promise<ReplyType<Code>>
}

// Definindo as opções do roteador com tipo genérico
export type RouterOptions<TData, Code extends ReplyKeysToCodes = keyof TReply<TData>> = {
    name: string
    path?: string
    description: string
    method: MethodApp<Code>[]
}

// Resolve o tipo de resposta baseado no código de status
type ResolveReplyTypeWithRouteGeneric<Reply extends TReply<unknown>, Code> =
    Code extends keyof Reply ? Reply[Code] : never

// Tipo de resposta Fastify, com base no código de status
export type ReplyType<Code extends ReplyKeysToCodes = keyof TReply<unknown>> = FastifyReply<
    RawServerBase,
    RawRequestDefaultExpression<RawServerBase>,
    RawReplyDefaultExpression<RawServerBase>,
    RouteGenericInterface,
    ContextConfigDefault,
    FastifySchema,
    FastifyTypeProviderDefault,
    ResolveReplyTypeWithRouteGeneric<TReply<unknown>, Code>
>

// Extensão do método code para o FastifyReply
declare module 'fastify' {
    interface FastifyReply {
        code<Code extends ReplyKeysToCodes>(statusCode: Code): FastifyReply<
            RawServerBase,
            RawRequestDefaultExpression<RawServerBase>,
            RawReplyDefaultExpression<RawServerBase>,
            RouteGenericInterface,
            ContextConfigDefault,
            FastifySchema,
            FastifyTypeProviderDefault,
            ResolveReplyTypeWithRouteGeneric<TReply<unknown>, Code>
        >
    }
}
