import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashFooter = () => {
  //
  const { username, status } = useAuth()
  //
  const navigate = useNavigate()
  const { pathname } = useLocation()
  //
  const onGoHomeClicked = () => navigate('/dash')
  let goHomeButton = null
  if (pathname !== '/dash') {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    )
  }
  //
  const pageContent = (
    <footer className="dash-footer">
      {goHomeButton}
      <div className="footer-elements">
        <span className="footer-username">{username}</span>

        <span className="footer-status">Status: {status}</span>
      </div>
    </footer>
  )
  return pageContent
}

export default DashFooter
