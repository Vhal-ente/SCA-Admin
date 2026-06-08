import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Trophy, Pencil, Trash2 } from "lucide-react";
import { TournamentModal, Tournament } from "@/components/TournamentModal";
import { Overview } from "@/components/TournamentOverview";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 3;

const Tournaments = () => {
  const { toast } = useToast();
  const [tournaments, setTournaments] = useState<Tournament[]>([
    { id: 1, name: "CODM Championship 2025", game: "Call of Duty Mobile", status: "Active", startDate: "2025-01-15", teams: 16, prize: "$10,000" },
    { id: 2, name: "MLBB Spring League", game: "Mobile Legends", status: "Upcoming", startDate: "2025-01-20", teams: 24, prize: "$15,000" },
    { id: 3, name: "Valorant Masters", game: "Valorant", status: "Completed", startDate: "2024-12-01", teams: 12, prize: "$8,000" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isViewingOverview, setIsViewingOverview] = useState(false); // Distinct page state flag
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
  const [filter, setFilter] = useState<"all" | "Active" | "Upcoming" | "Completed">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleCreateTournament = () => {
    setSelectedTournament(null);
    setModalOpen(true);
  };

  const handleEditTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsViewingOverview(true);
  };

  const handleViewDetails = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsViewingOverview(true); // Switches window context profile cleanly
  };

  const handleBack = () => {
    setSelectedTournament(null);
    setIsViewingOverview(false);
  };

  const handleDeleteClick = (tournament: Tournament) => {
    setTournamentToDelete(tournament);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (tournamentToDelete) {
      setTournaments(tournaments.filter((t) => t.id !== tournamentToDelete.id));
      toast({ title: "Tournament Deleted", description: `${tournamentToDelete.name} has been deleted.` });
      setTournamentToDelete(null);
      setCurrentPage(1);
    }
    setDeleteDialogOpen(false);
  };

 // Update the parameter type to allow either a Tournament rewrite sequence or a League object
const handleSaveTournament = (tournamentData: any) => {
  if (tournamentData.id) {
    setTournaments(
      tournaments.map((t) =>
        t.id === tournamentData.id 
          ? { 
              ...t, 
              ...tournamentData, 
              // Ensure startDate is always string-defined to appease the Tournament type compiler
              startDate: tournamentData.startDate || t.startDate 
            } as Tournament 
          : t
      )
    );
    toast({ title: "Updated successfully" });
  } else {
    // Fallback instantiation mechanics for creating new records
    const newTournament: Tournament = {
      ...tournamentData,
      startDate: tournamentData.startDate || new Date().toISOString().split('T')[0],
      id: Math.max(...tournaments.map((t) => t.id), 0) + 1,
    } as Tournament;
    setTournaments([...tournaments, newTournament]);
    toast({ title: "Created successfully" });
  }
  setModalOpen(false);
};

  const filteredTournaments = filter === "all" ? tournaments : tournaments.filter((t) => t.status === filter);

  const totalItemsCount = filteredTournaments.length;
  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE) || 1;
  const itemDisplayStart = totalItemsCount > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const itemDisplayEnd = Math.min(currentPage * ITEMS_PER_PAGE, totalItemsCount);
  const visibleTournaments = filteredTournaments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // ─── FULL PAGE INJECTION MATRIX DETECTED ───
  if (isViewingOverview && selectedTournament !== null) {
    return (
      <Overview
        tournament={selectedTournament}
        onSave={handleSaveTournament}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Tournaments</h1>
          <p className="text-muted-foreground">Manage and monitor all tournaments</p>
        </div>
        <Button onClick={handleCreateTournament} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Create Tournament
        </Button>
      </div>

      <div className="flex gap-2">
        {(["all", "Active", "Upcoming", "Completed"] as const).map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? "outline" : "ghost"}
            onClick={() => { setFilter(tab); setCurrentPage(1); }}
            className={filter === tab ? "border-primary text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground"}
          >
            {tab === "all" ? "All Tournaments" : tab}
          </Button>
        ))}
      </div>

      {visibleTournaments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleTournaments.map((tournament) => (
            <Card key={tournament.id} className="p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
              <div className="flex items-start justify-between mb-4">
                <Badge className={tournament.status === "Active" ? "bg-primary/20 text-primary border-primary" : tournament.status === "Upcoming" ? "bg-accent/20 text-accent border-accent" : "bg-muted text-muted-foreground border-muted"}>
                  {tournament.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditTournament(tournament)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(tournament)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{tournament.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tournament.game}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{tournament.teams} Teams</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-lg font-bold text-accent">{tournament.prize}</span>
                <Button variant="ghost" onClick={() => handleViewDetails(tournament)} className="text-primary hover:text-primary hover:bg-primary/10">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
          No matching operational tournament entries registered.
        </div>
      )}

      {/* --- PAGINATION CONTROL FOOTER --- */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-border text-xs font-bold uppercase tracking-wider text-muted-foreground gap-4">
        <span>Showing {itemDisplayStart}-{itemDisplayEnd} of {totalItemsCount} tournaments</span>
        
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} className={currentPage === 1 ? "opacity-45 pointer-events-none text-muted-foreground/60" : "cursor-pointer"} />
            </PaginationItem>

            {pageNumbers.map((page) => {
              const isActive = page === currentPage;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={isActive}
                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                    className={`w-8 h-8 rounded text-xs font-mono font-bold transition-colors ${isActive ? "bg-primary text-primary-foreground font-black hover:bg-primary hover:text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} className={currentPage === totalPages ? "opacity-45 pointer-events-none text-muted-foreground/60" : "cursor-pointer"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div> */}

      {/* --- ADD/EDIT MODAL TARGET OVERLAY --- */}
      <TournamentModal open={modalOpen} onOpenChange={setModalOpen} tournament={selectedTournament} onSave={handleSaveTournament} />

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tournament</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{tournamentToDelete?.name}"? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tournaments;