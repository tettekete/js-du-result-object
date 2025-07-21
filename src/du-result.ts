
export type DUResultT<T = unknown ,E = unknown> =
| {readonly ok: true, readonly ng: false, readonly data: T, readonly message: string}
| {readonly ok: false, readonly ng: true, readonly data: E, readonly message: string}
;

export default class DUResult<T, E = unknown>
{
	private constructor() {}
	
	static success(): DUResultT<undefined ,never>;
	static success(message: string): DUResultT<string ,never>;
	static success<T>(data?: T): DUResultT<T, never>;
	static success<T>(message: string, data?: T): DUResultT<T, never>;
	static success<T>(message: undefined | null, data?: T): DUResultT<T, never>;
	static success<T>(messageOrData?: string | T, data?: T): DUResultT<T | undefined, never>
	{
		return {
			ok: true,
			ng: false,
			data: (data ?? messageOrData) as T,
			message: typeof messageOrData === 'string' ? messageOrData : 'success'
		} as const;
	}

	static failure(): DUResultT<never, undefined>;
	static failure(message: string): DUResultT<never , string>;
	static failure<E>(data?: E): DUResultT<never, E>;
	static failure<E>(message: string, data?: E): DUResultT<never, E>;
	static failure<E>(message: undefined | null, data?: E): DUResultT<never, E>;
	static failure<E>(messageOrData?: string | E, data?: E): DUResultT<never, E | undefined>
	{
		return {
			ok: false,
			ng: true,
			data: (data ?? messageOrData) as E,
			message: typeof messageOrData === 'string' ? messageOrData : 'failure'
		} as const;
	}
}
