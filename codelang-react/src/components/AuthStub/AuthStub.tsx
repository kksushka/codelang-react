import './AuthStub.scss'
interface Props {
  title?: string
  description?: string
}

const AuthStub = ({
  title = 'Access denied',
  description = 'You need to be logged in to view this page.',
}: Props) => {
  return (
    <div className="login-prompt">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default AuthStub
