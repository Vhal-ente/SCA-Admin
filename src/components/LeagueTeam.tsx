import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";

const initialTeams = [
  {
    logo: "/logos/void.png",
    name: "VOID RUNNERS",
    tier: "Tier 1 • NA East",
    playerList: ["Aether_Alpha", "Viper_Zero", "Neon_Knight", "Shadow_Step", "Ghost_Protocol"],
    wins: 24,
    losses: 4,
  },
  {
    logo: "/logos/neon.png",
    name: "NEON PHANTOMS",
    tier: "Tier 1 • EU West",
    playerList: ["Cyber_Ghost", "Volt_Edge", "Static_Pulse", "Binary_Blade", "Data_Drift", "Code_Red"],
    wins: 21,
    losses: 7,
  },
  {
    logo: "/logos/glitch.png",
    name: "GLITCH LEGION",
    tier: "Tier 2 • SEA",
    playerList: ["Pixel_Paladin", "Bit_Basher", "Logic_Bomb", "Frame_Drop", "Buffer_Over"],
    wins: 18,
    losses: 10,
  },
];

export const TeamsTab = ({ activeTab }) => {
  const [teamList, setTeamList] = useState(initialTeams);
  const [editingPlayerIndex, setEditingPlayerIndex] = useState(null);
  const fileInputRef = useRef(null);

  const [modalData, setModalData] = useState({
    team: null,
    index: null,
    isOpen: false,
  });

  if (activeTab !== "TEAMS") return null;

  // Handle Image Upload (Converts to Base64 for local state persistence)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalData((prev) => ({
          ...prev,
          team: { ...prev.team, logo: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove player from the list
  const handleDeletePlayer = (playerIdx) => {
    const updatedPlayers = modalData.team.playerList.filter((_, i) => i !== playerIdx);
    setModalData((prev) => ({
      ...prev,
      team: { ...prev.team, playerList: updatedPlayers },
    }));
  };

  const handleInputChange = (e, field) => {
    setModalData((prev) => ({
      ...prev,
      team: { ...prev.team, [field]: e.target.value },
    }));
  };

  const handlePlayerNameChange = (e, playerIdx) => {
    const updatedPlayers = [...modalData.team.playerList];
    updatedPlayers[playerIdx] = e.target.value;
    setModalData((prev) => ({
      ...prev,
      team: { ...prev.team, playerList: updatedPlayers },
    }));
  };

  const handleSave = () => {
    const updated = [...teamList];
    updated[modalData.index] = modalData.team;
    setTeamList(updated);
    closeModal();
  };

  const closeModal = () => {
    setModalData({ team: null, index: null, isOpen: false });
    setEditingPlayerIndex(null);
  };

  return (
    <>
      <div className="bg-[#0f141c] text-white p-6 rounded-xl border border-[#2a2e42]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-[#00FFC6] uppercase mb-1">Ecosystem Management</p>
            <h2 className="text-3xl font-bold">Registered Teams</h2>
          </div>
          <button className="bg-[#00FFC6] text-black px-4 py-2 rounded-md font-medium hover:opacity-90">
            + Add Team
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "TOTAL TEAMS", value: teamList.length },
            { label: "ACTIVE ROSTERS", value: 160 },
            { label: "TOTAL PRIZE POOL", value: "$50,000" },
            { label: "PENDING VERIFICATION", value: 4 },
          ].map((stat, i) => (
            <div key={i} className="bg-[#222532] p-6 rounded-lg border border-[#2a2e42]">
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-lg font-semibold">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#0f141c] rounded-lg border border-[#1c2235] overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-[#1c2235] uppercase">
              <tr>
                <th className="p-3">Team Name</th>
                <th className="p-3">Players</th>
                <th className="p-3">Wins</th>
                <th className="p-3">Losses</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamList.map((team, i) => (
                <tr key={i} className="border-b border-[#1c2235] hover:bg-[#141b26]/30 ">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={team.logo} alt="" className="w-9 h-9 rounded-md object-cover border border-[#2a2e42]" />
                      <div>
                        <p className="font-semibold">{team.name}</p>
                        <p className="text-xs text-gray-400">{team.tier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{team.playerList.length} / 6</td>
                  <td className="p-3 text-[#00FFC6]">{team.wins}</td>
                  <td className="p-3 text-red-500">{team.losses}</td>
                  <td className="p-3">
                    <button
                      className="text-gray-400 hover:text-white text-lg"
                      onClick={() => setModalData({ team: JSON.parse(JSON.stringify(team)), index: i, isOpen: true })}
                    >
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={modalData.isOpen} onOpenChange={closeModal}>
        <DialogContent className="bg-[#2C2C2C] text-white border-[#1c2235] sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold border-b pb-4">Edit Team Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Team Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Name</label>
              <Input
                className="bg-transparent border-[#1c2235] text-white focus:border-[#00FFC6]"
                value={modalData.team?.name || ""}
                onChange={(e) => handleInputChange(e, "name")}
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Logo</label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-[#242424] cursor-pointer hover:border-[#00FFC6]"
                  onClick={() => fileInputRef.current.click()}
                >
                  {modalData.team?.logo ? (
                    <img src={modalData.team.logo} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <FiUpload className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="text-xs bg-transparent px-3 py-2 border rounded-xl hover:bg-sidebar"
                  >
                    Change Logo
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
            </div>

            {/* Player Roster */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Active Roster ({modalData.team?.playerList.length}/6)
              </label>
              <div className="space-y-2">
                {modalData.team?.playerList.map((playerName, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-lg bg-[#242424] border"
                  >
                    <div className="flex-1">
                      {editingPlayerIndex === idx ? (
                        <Input
                          autoFocus
                          className="h-8 bg-[#2C2C2C] text-sm"
                          value={playerName}
                          onChange={(e) => handlePlayerNameChange(e, idx)}
                          onBlur={() => setEditingPlayerIndex(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingPlayerIndex(null)}
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-200">{playerName}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setEditingPlayerIndex(idx)}
                        className="p-2 text-gray-500 hover:text-[#00FFC6]"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeletePlayer(idx)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#1c2235]">
            <button 
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white" 
              onClick={closeModal}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2 bg-[#00FFC6] text-black font-bold rounded-md hover:opacity-90 active:scale-95 transition-all"
              onClick={handleSave}
            >
              Update Team
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};