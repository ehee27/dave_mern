import { useGetUsersQuery } from './usersApiSlice';
import User from './User';

const UsersList = () => {
  // destrcuture the users data status and alias 'users'
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;
  if (isLoading) content = <p>Loading...</p>;
  //
  if (isError) {
    content = (
      <p className="{isError ? 'errmsg' : 'offscreen}">
        {error?.data?.message}
      </p>
    );
  }
  //
  if (isSuccess) {
    // desctructuring the ids array
    const { ids } = users;
    // create a 'table content' variable - essentially user data
    // check for ids length - because it's an array
    const tableContent = ids?.length
      ? // map the ids array and inject our User components by passing the userId
        ids.map(userId => <User key={userId} userId={userId} />)
      : null;

    // format a table with column headings
    content = (
      <table className="table table-users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        {/* // use the tableContent variable  */}
        <tbody>{tableContent}</tbody>
      </table>
    );
    // return the overall content variable we just setup
    return <section>{content}</section>;
  }
};

export default UsersList;
