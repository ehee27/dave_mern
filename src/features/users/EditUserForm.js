import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../../config/roles';
//
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
//

const EditUserForm = ({ user }) => {
  // LOADED HOOKS
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  //
  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();
  //
  const navigate = useNavigate();
  // state vars
  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);
  //
  // useEffect to valid
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);
  //
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);
  //
  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername('');
      setPassword('');
      setRoles([]);
      navigate('/dash/users');
    }
  }, [isSuccess, isDelSuccess, navigate]);
  //
  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);

  // we'll be selecting options from a form - 'HTMLCollection'
  const onRolesChanged = e => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setRoles(values);
  };
  //
  const onActiveChanged = () => setActive(prev => !prev);
  //
  const onSavedUserClicked = async e => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };
  //
  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };
  // This will map through our ROLES that we imported - create a new Array that we can .map through and create an HTML option for each.
  const options = Object.values(ROLES).map(role => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  // alternative to calling '&' a bunch. All in an Array and use '.every'
  let canSave;
  if (password && !validPassword) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }
  //classes that we may or may not want to apply
  const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles.length)
    ? 'form__input--incomplete'
    : '';
  const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSavedUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />
        <label
          className="form__lable form__checkbox-container"
          htmlFor="user-active"
        >
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          className={`form__input ${validRolesClass}`}
          id="roles"
          name="roles"
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default EditUserForm;
