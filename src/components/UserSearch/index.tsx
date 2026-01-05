import { useQuery } from "@tanstack/react-query";
import "./UserSearch.css";

import { useEffect, useState, type ChangeEvent } from "react";
import { fetchGithubUser } from "../../api/git-hub";
import { UserCard } from "../UserCard";
import { RecentSearches } from "../RecentSearches";
import { getLSRecentUsers, setLSRecentUsers } from "../../utils/localstorage";

export function UserSearch() {
  const [userName, setUserName] = useState("");
  const [submittedUserName, setSubmittedUserName] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() =>
    getLSRecentUsers()
  );

  useEffect(() => {
    setLSRecentUsers(recentUsers);
  }, [recentUsers]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUserName],
    queryFn: async () => fetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  return (
    <form
      action={(formData) => {
        const userName = formData.get("username");
        const trimmed = (userName ?? "").toString().trim();
        if (!trimmed) {
          return;
        }
        setSubmittedUserName(trimmed);
        setRecentUsers((prev) => {
          const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
          return updated.slice(0, 5);
        });
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
      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username) => {
            setUserName(username);
            setSubmittedUserName(username);
          }}
        />
      )}
    </form>
  );
}
