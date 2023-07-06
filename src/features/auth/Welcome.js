import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRightFromBracket,
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faFileLines,
  faFolderOpen,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

const Welcome = () => {
  //
  const { username, isManager, isAdmin } = useAuth()
  //
  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date)
  //
  const pageContent = (
    <section className="welcome">
      <p>{today}</p>
      <h3>
        Welcome <span>{username}</span>
      </h3>
      <p>
        <Link to="/dash/notes">
          <FontAwesomeIcon icon={faFolderOpen} className="icon" />
          View techNotes
        </Link>
      </p>
      <p>
        <Link to="/dash/notes/new">
          <FontAwesomeIcon icon={faFileLines} className="icon" />
          Add New techNote
        </Link>
      </p>
      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users">
            <FontAwesomeIcon icon={faUserGear} className="icon" />
            View User Settings
          </Link>
        </p>
      )}

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users/new">
            <FontAwesomeIcon icon={faUser} className="icon" />
            Add New User
          </Link>
        </p>
      )}
    </section>
  )
  //
  return pageContent
}

export default Welcome
