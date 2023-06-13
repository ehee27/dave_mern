import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // for editing

import { useSelector } from 'react-redux';
import { selectUserById } from './usersApiSlice';

// received userId from props to populate
// useNavigate() to navigate away for editing
// if the user exists we set a handle edit function - used later
// set a 'roles string' to populate table
// set a cell status variable

const User = ({ userId }) => {
  //
  const navigate = useNavigate();
  //
  const user = useSelector(state => selectUserById(state, userId));
  //
  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);
    // pull all user roles - set to string - replace commas
    const userRolesString = user.roles.toString().replaceAll(',', ', ');
    //
    const cellStatus = user.active ? '' : 'table__cell--inactive';
    //
    return (
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

export default User;
