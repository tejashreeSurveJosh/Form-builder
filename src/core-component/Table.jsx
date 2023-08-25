import React from "react";
import { Table as CustomTable } from "reactstrap";

export const Table = () => {
  const data = [
    {
      no: 1,
      name: "Mark",
      lastName: "Otto",
      username: "make@otto",
    },
    {
      no: 2,
      name: "Jack",
      lastName: "hackson ",
      username: "jack@hackson",
    },
    {
      no: 3,
      name: "Jacob",
      lastName: "Willson",
      username: "Jacob@willson",
    },
    {
      no: 4,
      name: "Larry",
      lastName: "fill",
      username: "larry@fill",
    },
  ];
  return (
    <CustomTable style={{ width: "18rem" }} bordered>
      <thead>
        <th>Sr.</th>
        <th>Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </thead>
      <tbody>
        {data.map(({ no, name, lastName, username }) => (
          <tr>
            <td>{no}</td>
            <td>{name}</td>
            <td>{lastName}</td>
            <td>{username}</td>
          </tr>
        ))}
      </tbody>
    </CustomTable>
  );
};
