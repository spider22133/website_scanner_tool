import { MessageState } from '../../slices/message.slice'
import { Alert } from '@mui/material'

type Props = {
  websiteId: string
  messages: MessageState[]
}
export const APIErrorNotification = ({ messages, websiteId }: Props) => {
  return (
    <>
      {messages.length !== 0 ? (
        <div className="form-group mt-3">
          {messages.map(({ message, id }, index) => {
            return id === websiteId ? (
              <Alert key={index} severity="error">
                {message}
              </Alert>
            ) : (
              ''
            )
          })}
        </div>
      ) : (
        ''
      )}
    </>
  )
}
