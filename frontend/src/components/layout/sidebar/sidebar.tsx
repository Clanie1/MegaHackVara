import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import { ROUTES } from "@/app/consts";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdAccessTime, MdList, MdGroup } from "react-icons/md";
import { FaUserFriends, FaTelegram} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useAccount } from "@gear-js/react-hooks";
import { useSailsCalls } from "@/app/hooks";

export function Sidebar() {
  const navigate = useNavigate();
  const { account } = useAccount();
  const sails = useSailsCalls();

  const [groups, setGroups] = useState([]);

  const handleTwitterShare = () => {
    window.open("https://x.com/chain_split?s=11", "_blank");
  };
  const handleTelegramShare = () => {
    window.open("https://web.telegram.org/", "_blank");
  };

  const fetchGroups = async () => {
    if (!sails || !account) {
      return;
    }

    try {
      const response = await sails.query("Service/QueryActorGroups", {
        userId: account.decodedAddress,
      });
      setGroups(response);
    } catch (e) {
      console.error("Failed to fetch groups:", e);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [account, sails]);

  return (
    <div className="sidebar">
      {/* Secciones Principales */}
      <div className="sidebar-sections">
        <div className="sidebar-item" onClick={() => navigate(ROUTES.MAIN)}>
          <MdDashboard className="icon" />
          <span>Panel de control</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate(ROUTES.HOME)}>
          <MdAccessTime className="icon" />
          <span>Actividad reciente</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate(ROUTES.EXPENSES)}>
          <MdList className="icon" />
          <span>Todos los gastos</span>
        </div>
      </div>

      {/* Sección de Grupos */}
      <div className="groups-section">
        <div
          className="section-title"
          onClick={() => navigate(ROUTES.GROUPLIST)}
        >
          <h3>GRUPOS</h3>
        </div>

        <div className="groups-list">
          {groups.length > 0 ? (
            groups.map((group: any, index) => (
              <div
                key={index}
                className="sidebar-item group-item"
                onClick={() => {
                  window.location.href = `/group-details/${group.id}`;
                }}
              >
                <FaUserFriends className="icon" />
                <span>{group.name}</span>
              </div>
            ))
          ) : (
            <div className="no-groups">No tienes grupos</div>
          )}
        </div>
      </div>

      {/* Sección de Invitación */}
      <div className="invite-section">
        <button className="share-button facebook" onClick={handleTelegramShare}>
          <FaTelegram className="icon" />
          Compartir
        </button>
        <button className="share-button twitter" onClick={handleTwitterShare}>
          <FaXTwitter className="icon" />
          Tuitear
        </button>
      </div>
    </div>
  );
}
