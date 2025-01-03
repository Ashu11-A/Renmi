import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Card, CardDescription, CardFooter, CardTitle } from '../ui/card'
import { ReactNode } from 'react'

export function AreYouSure ({ callback, close, description }: {
    callback: () => void,
    close: () => void,
    description: ReactNode,
}) {

  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.1 } }}
    >
      <Card className='px-6 pt-6'>
        <CardTitle
          className='text-start py-2'
        >Tem certeza que deseja fazer isso?</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardFooter className='justify-between pt-2 pb-4'>
          <Button
            variant={'destructive'}
            onClick={() => callback()}
          >
            Tenho
          </Button>
          <Button
            onClick={() => close()}
          >
            Não tenho
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}