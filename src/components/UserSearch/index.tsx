import { useQuery } from "@tanstack/react-query";
import "./UserSearch.css";

import { useEffect, useState, type ChangeEvent } from "react";
import { fetchGithubUser, searchGithubUser } from "../../api/git-hub";
import { UserCard } from "../UserCard";
import { RecentSearches } from "../RecentSearches";
import { getLSRecentUsers, setLSRecentUsers } from "../../utils/localstorage";
import { useDebounce } from "use-debounce";
import type { GitHubUser } from "../../types";

export function UserSearch() {
  const [userName, setUserName] = useState("");
  const [submittedUserName, setSubmittedUserName] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() =>
    getLSRecentUsers()
  );

  useEffect(() => {
    setLSRecentUsers(recentUsers);
  }, [recentUsers]);

  const [debouncedUsername] = useDebounce(userName, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", submittedUserName],
    queryFn: async () => fetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedUsername],
    queryFn: async () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
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
        setUserName("");
        setRecentUsers((prev) => {
          const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
          return updated.slice(0, 5);
        });
      }}
      className="form"
    >
      <div className="dropdown-wrapper">
        <input
          type="text"
          name="username"
          placeholder="Enter GitHub Username..."
          value={userName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const username = e.target.value;
            setUserName(username);
            setShowSuggestions(username.trim().length > 1);
          }}
        />
        {showSuggestions && suggestions?.length > 0 && (
          <ul className="suggestions">
            {suggestions.slice(0, 5).map((user: GitHubUser) => (
              <li
                key={user.login}
                onClick={() => {
                  setUserName(user.login);
                  setShowSuggestions(false);
                  if (submittedUserName !== user.login) {
                    setSubmittedUserName(user.login);
                  } else {
                    refetch();
                  }
                }}
              >
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="avatar-xs"
                />
                {user.login}
              </li>
            ))}
          </ul>
        )}
      </div>

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
