import { useQuery } from "@tanstack/react-query";
import "./UserSearch.css";

import { useState, type ChangeEvent } from "react";
import { FaGithubAlt } from "react-icons/fa";

export function UserSearch() {
  const [userName, setUserName] = useState("");
  const [submittedUserName, setSubmittedUserName] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUserName],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_GITHUB_API_URL}/users/${submittedUserName}`
      );
      if (!res.ok) {
        throw new Error("User not found");
      }
      const data = await res.json();
      console.log(data);
      return data;
    },
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
      {data && (
        <div className="user-card">
          <img src={data.avatar_url} alt={data.name} className="avatar" />
          <h2>{data.name || data.login}</h2>
          <div className="bio">{data.bio}</div>
          <a
            href={data.html_url}
            className="profile-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithubAlt />
            View GitGub Profile
          </a>
        </div>
      )}
    </form>
  );
}
