import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Trophy, Pencil, Trash2, ArrowRight } from "lucide-react";
import { TournamentModal, Tournament } from "@/components/TournamentModal";
import { Overview } from "@/components/TournamentOverview";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { api, type ApiTournament } from "@/lib/api";
import { toTournamentPayload, toUiTournament } from "@/lib/competitions";
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
  const location = useLocation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loadError, setLoadError] = useState("");

  const loadTournaments = useCallback(async () => {
    try {
      const { tournaments: data } = await api.get<{ tournaments: ApiTournament[] }>("/admin/tournaments");
      setTournaments(data.map(toUiTournament));
      setLoadError("");
    } catch (error) {
      setLoadError((error as Error).message);
    }
  }, []);

  useEffect(() => { loadTournaments(); }, [loadTournaments]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isViewingOverview, setIsViewingOverview] = useState(false); // Distinct page state flag
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
  const [filter, setFilter] = useState<"Active" | "Upcoming" | "Completed">("Active");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const tournamentId = (location.state as { tournamentId?: number } | null)?.tournamentId;
    const tournament = tournaments.find((item) => item.id === tournamentId);

    if (tournament) {
      setSelectedTournament(tournament);
      setIsViewingOverview(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, tournaments]);

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

  const handleDeleteConfirm = async () => {
    if (tournamentToDelete) {
      try {
        await api.delete(`/admin/tournaments/${tournamentToDelete.id}`);
        await loadTournaments();
        toast({ title: "Tournament Deleted", description: `${tournamentToDelete.name} has been deleted.` });
      } catch (error) {
        toast({ title: "Could not delete", description: (error as Error).message, variant: "destructive" });
      }
      setTournamentToDelete(null);
      setCurrentPage(1);
    }
    setDeleteDialogOpen(false);
  };

const handleSaveTournament = async (tournamentData: Partial<Tournament> & { id?: string }) => {
  const payload = toTournamentPayload(tournamentData);
  try {
    if (tournamentData.id) {
      await api.patch(`/admin/tournaments/${tournamentData.id}`, payload);
      toast({ title: "Updated successfully" });
    } else {
      await api.post("/admin/tournaments", payload);
      toast({ title: "Created successfully" });
    }
    await loadTournaments();
    setModalOpen(false);
  } catch (error) {
    toast({ title: "Could not save", description: (error as Error).message, variant: "destructive" });
  }
};

// Publishing is what makes a competition visible on the public site.
const togglePublication = async (tournament: Tournament) => {
  const next = tournament.publicationStatus === "Published" ? "draft" : "published";
  try {
    await api.patch(`/admin/tournaments/${tournament.id}`, { publicationStatus: next });
    await loadTournaments();
    toast({ title: next === "published" ? "Published to the site" : "Hidden from the site" });
  } catch (error) {
    toast({ title: "Could not update", description: (error as Error).message, variant: "destructive" });
  }
};

  const filteredTournaments = tournaments.filter((t) => t.status === filter);

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
    <div className="p-5 md:p-8 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-6 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sca-eyebrow mb-3">Competition operations</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">Tournament Management</h1>
          <p className="text-muted-foreground">Track every competition from registration through final results.</p>
        </div>
        <Button onClick={handleCreateTournament} className="h-11 rounded-sm bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" /> Create Tournament
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {(["Active", "Upcoming", "Completed"] as const).map((tab) => {
          const count = tournaments.filter((tournament) => tournament.status === tab).length;
          return (
          <button
            type="button"
            key={tab}
            onClick={() => { setFilter(tab); setCurrentPage(1); }}
            className={`flex min-w-36 items-center justify-between gap-5 rounded-sm border px-5 py-3 text-sm font-semibold transition-colors ${
              filter === tab
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {tab}
            <span className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs ${
              filter === tab ? "bg-foreground/10" : "bg-secondary"
            }`}>{count}</span>
          </button>
        )})}
      </div>

      {loadError && (
        <p role="alert" className="mb-5 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {loadError}
        </p>
      )}

      {visibleTournaments.length > 0 ? (
        <div className="space-y-5">
          {visibleTournaments.map((tournament) => (
            <Card key={tournament.id} className="group overflow-hidden rounded-sm border-border bg-card shadow-none transition-colors hover:border-primary/50">
              <div className="grid md:grid-cols-[minmax(260px,38%)_1fr]">
                <div className="relative min-h-56 overflow-hidden border-b border-border md:min-h-72 md:border-b-0 md:border-r">
                  <img src="/arena.png" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07100e]/80 via-transparent to-transparent" />
                  <Badge className="absolute left-5 top-5 rounded-sm border-0 bg-primary px-3 py-1.5 font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary">
                    {tournament.status}
                  </Badge>
                  <Badge className={`absolute right-5 top-5 rounded-sm border-0 px-3 py-1.5 font-bold uppercase tracking-wider ${tournament.publicationStatus === "Published" ? "bg-emerald-500 text-black hover:bg-emerald-500" : "bg-slate-700 text-slate-200 hover:bg-slate-700"}`}>
                    {tournament.publicationStatus === "Published" ? "Live on site" : "Draft"}
                  </Badge>
                  <p className="absolute bottom-5 left-5 right-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {tournament.game}
                  </p>
                </div>
                <div className="flex min-w-0 flex-col justify-between p-6 md:p-8">
                  <div>
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="sca-eyebrow mb-2">{tournament.game}</p>
                        <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{tournament.name}</h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => togglePublication(tournament)} className="h-9 rounded-sm text-xs font-bold uppercase tracking-wider">
                          {tournament.publicationStatus === "Published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Edit ${tournament.name}`} onClick={() => handleEditTournament(tournament)} className="h-9 w-9 rounded-sm text-muted-foreground hover:bg-primary/10 hover:text-primary">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Delete ${tournament.name}`} onClick={() => handleDeleteClick(tournament)} className="h-9 w-9 rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
                      <div className="bg-secondary p-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Start date</p>
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Calendar className="w-4 h-4 text-primary" /> {new Date(`${tournament.startDate}T00:00:00`).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-secondary p-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{tournament.mode === "Team" ? "Teams" : "Players"}</p>
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Users className="w-4 h-4 text-primary" /> {tournament.teams}</p>
                      </div>
                      <div className="col-span-2 bg-secondary p-4 sm:col-span-1">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Prize / entry</p>
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Trophy className="w-4 h-4 text-primary" /> {tournament.prize} · {tournament.entryType === "Paid" ? tournament.entryFee : "Free"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                    <Button onClick={() => handleViewDetails(tournament)} className="h-10 rounded-sm bg-primary px-5 font-bold text-primary-foreground hover:bg-primary/90">
                      Manage Tournament <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Registration and competition controls</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-sm border border-dashed border-border bg-card text-center">
          <Trophy className="mb-4 h-8 w-8 text-primary" />
          <h3 className="font-semibold text-foreground">No {filter.toLowerCase()} tournaments</h3>
          <p className="mt-1 text-sm text-muted-foreground">Tournament records will appear here when their status changes.</p>
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
