import { useQuery } from "@tanstack/react-query";
import "./UserSearch.css";

import { useState, type ChangeEvent } from "react";
import { fetchGithubUser } from "../../api/git-hub";
import { UserCard } from "../UserCard";

export function UserSearch() {
  const [userName, setUserName] = useState("");
  const [submittedUserName, setSubmittedUserName] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUserName],
    queryFn: async () => fetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  return (
    <form
      action={(formData) => {
        const userName = formData.get("username");
        setSubmittedUserName((userName ?? "").toString().trim());
      }}
      className="form"
    >
      <input
        type="text"
        name="username"
        placeholder="Enter GitHub Username..."
        value={userName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserName(e.target.value)
        }
      />
      <button type="submit">Search</button>
      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}
      {data && <UserCard user={data} />}
    </form>
  );
}
