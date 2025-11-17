"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Image as ImageIcon,
  FileText,
  X,
  Bell,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Activity } from "@/store/useTripStore";

interface ItineraryBoardProps {
  tripStartDate: string;
  tripEndDate: string;
  activities: Activity[];
  onSetTripDates: (startDate: string, endDate: string) => void;
  onAddActivity: (activity: Activity) => void;
  onUpdateActivity: (id: number, activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
}

export function ItineraryBoard({
  tripStartDate,
  tripEndDate,
  activities,
  onSetTripDates,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}: ItineraryBoardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDatesDialogOpen, setIsDatesDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [startDate, setStartDate] = useState(tripStartDate);
  const [endDate, setEndDate] = useState(tripEndDate);
  const [category, setCategory] = useState("activities");
  const [remindMe, setRemindMe] = useState(false);

  // Calculate days
  const days: Date[] = [];
  if (tripStartDate && tripEndDate) {
    const start = new Date(tripStartDate);
    const end = new Date(tripEndDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
  }

  const handleOpenAddDialog = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setEditingActivity(null);
    setTitle("");
    setDescription("");
    setTime("");
    setNotes("");
    setImages([]);
    setImageInput("");
    setCategory("activities");
    setRemindMe(false);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (activity: Activity) => {
    setEditingActivity(activity);
    setSelectedDayIndex(activity.dayIndex);
    setTitle(activity.title);
    setDescription(activity.description || "");
    setTime(activity.time || "");
    setNotes(activity.notes || "");
    setImages(activity.images || []);
    setImageInput("");
    setCategory(activity.category || "activities");
    setRemindMe(activity.remindMe || false);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const activityData: Activity = {
      id: editingActivity?.id || Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      time: time || undefined,
      dayIndex: selectedDayIndex,
      notes: notes.trim() || undefined,
      images: images.length > 0 ? images : undefined,
      completed: editingActivity?.completed || false,
      category: category || undefined,
      remindMe: remindMe,
    };

    if (editingActivity) {
      onUpdateActivity(editingActivity.id, activityData);
    } else {
      onAddActivity(activityData);
    }

    setIsDialogOpen(false);
    setTitle("");
    setDescription("");
    setTime("");
    setNotes("");
    setImages([]);
    setImageInput("");
    setCategory("activities");
    setRemindMe(false);
    setEditingActivity(null);
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleToggleComplete = (activity: Activity) => {
    onUpdateActivity(activity.id, {
      ...activity,
      completed: !activity.completed,
    });
  };

  const handleSaveDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onSetTripDates(startDate, endDate);
      setIsDatesDialogOpen(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDayActivities = (dayIndex: number) => {
    return activities
      .filter((a) => a.dayIndex === dayIndex)
      .sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });
  };

  if (!tripStartDate || !tripEndDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trip Itinerary</CardTitle>
          <CardDescription>Plan your day-by-day activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              Set your trip dates to start planning your itinerary
            </p>
            <Dialog
              open={isDatesDialogOpen}
              onOpenChange={setIsDatesDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Trip Dates
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Trip Dates</DialogTitle>
                  <DialogDescription>
                    Choose your trip start and end dates
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveDates} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDatesDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Dates</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trip Itinerary</CardTitle>
            <CardDescription>
              {days.length} day{days.length !== 1 ? "s" : ""} •{" "}
              {formatDate(days[0])} - {formatDate(days[days.length - 1])}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStartDate(tripStartDate);
              setEndDate(tripEndDate);
              setIsDatesDialogOpen(true);
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Edit Dates
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Horizontal scrollable kanban board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {days.map((day, index) => {
            const dayActivities = getDayActivities(index);
            return (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] bg-muted/30 p-3 space-y-3"
              >
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Day {index + 1}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(day)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenAddDialog(index)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Activities */}
                <div className="space-y-2 min-h-[100px]">
                  {dayActivities.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No activities yet
                    </div>
                  ) : (
                    dayActivities.map((activity) => (
                      <Card
                        key={activity.id}
                        className={`p-3 ${
                          activity.completed
                            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                            : ""
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={activity.completed}
                              onCheckedChange={() =>
                                handleToggleComplete(activity)
                              }
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`font-medium text-sm flex-1 ${
                                    activity.completed
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {activity.title}
                                </h4>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      handleOpenEditDialog(activity)
                                    }
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      onDeleteActivity(activity.id)
                                    }
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                              {activity.time && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {activity.time}
                                </div>
                              )}
                              {activity.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {activity.description}
                                </p>
                              )}
                              {activity.notes && (
                                <div className="flex items-start gap-1 text-xs text-muted-foreground mt-1 p-2 bg-muted/50">
                                  <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                                  <p className="line-clamp-2">
                                    {activity.notes}
                                  </p>
                                </div>
                              )}
                              {activity.images &&
                                activity.images.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <ImageIcon className="h-3 w-3" />
                                    <span>
                                      {activity.images.length} photo(s)
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add/Edit Activity Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? "Edit Activity" : "Add Activity"}
              </DialogTitle>
              <DialogDescription>
                {editingActivity
                  ? "Update the activity details"
                  : `Add an activity for Day ${selectedDayIndex + 1}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activity-title">Activity Title *</Label>
                <Input
                  id="activity-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Visit Tokyo Tower"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    // Auto-enable reminder for transport
                    if (value === "transport") {
                      setRemindMe(true);
                    }
                  }}
                >
                  <SelectTrigger id="activity-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transport">🚌 Transport</SelectItem>
                    <SelectItem value="food">🍽️ Food & Dining</SelectItem>
                    <SelectItem value="hotel">🏨 Accommodation</SelectItem>
                    <SelectItem value="activities">🎯 Activities</SelectItem>
                    <SelectItem value="sightseeing">📸 Sightseeing</SelectItem>
                    <SelectItem value="other">📌 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-time">Time (optional)</Label>
                <Input
                  id="activity-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 py-2 border-y">
                <Checkbox
                  id="remind-me"
                  checked={remindMe}
                  onCheckedChange={(checked) => setRemindMe(checked as boolean)}
                />
                <Label
                  htmlFor="remind-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  Remind me 30 & 10 minutes before
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-description">
                  Description (optional)
                </Label>
                <Textarea
                  id="activity-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes or details about this activity"
                  rows={2}
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">
                    Diary Notes (optional)
                  </Label>
                </div>
                <Textarea
                  id="activity-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your experience, thoughts, or memories here..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">
                    Photos (optional)
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Paste image URL"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImage}
                  >
                    Add
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="h-12 w-12 object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23ddd' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='12'%3ENo Image%3C/svg%3E";
                          }}
                        />
                        <span className="flex-1 text-xs truncate">{img}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingActivity ? "Update" : "Add"} Activity
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dates Dialog */}
        <Dialog open={isDatesDialogOpen} onOpenChange={setIsDatesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Trip Dates</DialogTitle>
              <DialogDescription>
                Update your trip start and end dates
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveDates} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end-date">End Date</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDatesDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Dates</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
