import type { GitHubUser } from "../../types";
import "./UserCard.css";
import { FaGithubAlt } from "react-icons/fa";

export function UserCard({ user }: { user: GitHubUser }) {
  return (
    <div className="user-card">
      <img src={user.avatar_url} alt={user.name} className="avatar" />
      <h2>{user.name || user.login}</h2>
      <div className="bio">{user.bio}</div>
      <a
        href={user.html_url}
        className="profile-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithubAlt />
        View GitGub Profile
      </a>
    </div>
  );
}
