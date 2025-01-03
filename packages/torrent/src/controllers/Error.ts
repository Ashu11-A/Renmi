import type { WrapperErrorProps } from '../types/error'

export class WrapperError extends Error {
  constructor (public options: WrapperErrorProps) {
    super(options.human_readable, { cause: options.status_text })
  }
}