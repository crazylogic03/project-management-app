import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../styles/ProjectDetails.css";
import {
  Users,
  CalendarDays,
  ClipboardList,
  CheckCircle,
  Trash2,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // MODALS
  const [showListModal, setShowListModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [showCardModal, setShowCardModal] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [descInput, setDescInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  const [newListName, setNewListName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentList, setCurrentList] = useState(null);

  /* --------------------------------------
       LOAD PROJECT
  -------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/boards/${id}`);
        const data = await res.json();
        if (!res.ok) return;

        setProject(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  /* --------------------------------------
      ADD LIST
  -------------------------------------- */
  const createList = async () => {
    if (!newListName.trim()) return alert("List name required");

    const res = await fetch(`http://localhost:3000/api/lists/${project.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newListName }),
    });

    const data = await res.json();

    setProject({
      ...project,
      lists: [...project.lists, { ...data, cards: [] }],
    });

    setNewListName("");
    setShowListModal(false);
  };

  /* --------------------------------------
      ADD TASK
  -------------------------------------- */
  const createTask = async () => {
    if (!newTaskTitle.trim()) return alert("Task title required");

    const res = await fetch(`http://localhost:3000/api/cards/${currentList}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTaskTitle,
        boardId: project.id,
      }),
    });

    const card = await res.json();

    const updated = project.lists.map((list) =>
      list.id === currentList
        ? { ...list, cards: [...list.cards, card] }
        : list
    );

    setProject({ ...project, lists: updated });
    setNewTaskTitle("");
    setShowTaskModal(false);
  };

  /* --------------------------------------
      DELETE LIST
  -------------------------------------- */
  const deleteList = async (listId) => {
    if (!confirm("Delete this entire list?")) return;

    await fetch(`http://localhost:3000/api/lists/${listId}`, {
      method: "DELETE",
    });

    setProject({
      ...project,
      lists: project.lists.filter((l) => l.id !== listId),
    });
  };

  /* --------------------------------------
      UPDATE COMPLETED (Done / Not Done)
  -------------------------------------- */
  const updateCardCompleted = async (cardId, listId, completed) => {
    // Optimistic UI update
    setProject((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId
          ? {
            ...l,
            cards: l.cards.map((c) =>
              c.id === cardId ? { ...c, completed } : c
            ),
          }
          : l
      ),
    }));

    if (activeCard && activeCard.id === cardId) {
      setActiveCard((prev) => ({ ...prev, completed }));
    }

    if (cardDetails && cardDetails.id === cardId) {
      setCardDetails((prev) => ({ ...prev, completed }));
    }

    try {
      await fetch(`http://localhost:3000/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
    } catch (err) {
      console.error("❌ Error updating completed status:", err);
    }
  };

  /* --------------------------------------
      DRAG HANDLER
  -------------------------------------- */
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceList = Number(source.droppableId);
    const destList = Number(destination.droppableId);

    if (sourceList === destList && source.index === destination.index) return;

    let updated = [...project.lists];

    let fromList = updated.find((l) => l.id === sourceList);
    let toList = updated.find((l) => l.id === destList);

    const dragged = fromList.cards[source.index];

    // Remove from original
    fromList.cards.splice(source.index, 1);

    // Add into destination
    toList.cards.splice(destination.index, 0, dragged);

    setProject({ ...project, lists: updated });

    // Sync to backend
    await fetch("http://localhost:3000/api/cards/move", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId: Number(draggableId),
        toListId: destList,
        newOrder: destination.index,
      }),
    });
  };

  /* --------------------------------------
      OPEN CARD MODAL
  -------------------------------------- */
  const openCard = async (card) => {
    setActiveCard(card);
    setShowCardModal(true);

    const res = await fetch(
      `http://localhost:3000/api/cards/details/${card.id}`
    );
    const data = await res.json();

    setCardDetails(data);
    setDescInput(data.description || "");
  };

  /* --------------------------------------
      UPDATE CARD TITLE
  -------------------------------------- */
  const updateCardTitle = async () => {
    await fetch(`http://localhost:3000/api/cards/${activeCard.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: cardDetails.title }),
    });

    setProject({
      ...project,
      lists: project.lists.map((list) =>
        list.id === activeCard.listId
          ? {
            ...list,
            cards: list.cards.map((c) =>
              c.id === activeCard.id
                ? { ...c, title: cardDetails.title }
                : c
            ),
          }
          : list
      ),
    });
  };

  /* --------------------------------------
      SAVE DESCRIPTION
  -------------------------------------- */
  const saveDescription = async () => {
    await fetch(`http://localhost:3000/api/cards/${activeCard.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: descInput }),
    });

    setCardDetails({ ...cardDetails, description: descInput });
  };

  /* --------------------------------------
      COMMENTS
  -------------------------------------- */
  const addComment = async () => {
    if (!commentInput.trim()) return;

    const res = await fetch(
      `http://localhost:3000/api/comments/${activeCard.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentInput,
          userId: project.members[0].userId,
          boardId: project.id,
        }),
      }
    );

    const newComment = await res.json();

    setCardDetails({
      ...cardDetails,
      comments: [newComment, ...(cardDetails.comments || [])],
    });

    setCommentInput("");
  };

  const deleteComment = async (commentId) => {
    await fetch(`http://localhost:3000/api/comments/${commentId}`, {
      method: "DELETE",
    });

    setCardDetails({
      ...cardDetails,
      comments: cardDetails.comments.filter((c) => c.id !== commentId),
    });
  };

  /* --------------------------------------
      LABELS
  -------------------------------------- */
  const assignLabel = async (labelId) => {
    await fetch("http://localhost:3000/api/labels/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: activeCard.id, labelId }),
    });

    const label = project.labels.find((l) => l.id === labelId);

    setCardDetails({
      ...cardDetails,
      labels: [...cardDetails.labels, { labelId, label }],
    });
  };

  const removeLabel = async (labelId) => {
    await fetch("http://localhost:3000/api/labels/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: activeCard.id, labelId }),
    });

    setCardDetails({
      ...cardDetails,
      labels: cardDetails.labels.filter((l) => l.labelId !== labelId),
    });
  };

  /* --------------------------------------
      DELETE TASK
  -------------------------------------- */
  const deleteTask = async () => {
    if (!confirm("Delete this task?")) return;

    await fetch(`http://localhost:3000/api/cards/${activeCard.id}`, {
      method: "DELETE",
    });

    setProject({
      ...project,
      lists: project.lists.map((l) =>
        l.id === activeCard.listId
          ? { ...l, cards: l.cards.filter((c) => c.id !== activeCard.id) }
          : l
      ),
    });

    setShowCardModal(false);
  };

  return (
    <div className="project-container">
      <Sidebar />

      <main className="project-main">
        {/* HEADER */}
        <header className="project-header">
          <h1>{project.title}</h1>
          <p>{project.organization || "My Workspace"}</p>
        </header>

        {/* OVERVIEW ROW */}
        <div className="project-overview">
          <div className="project-card">
            <ClipboardList size={20} />
            <div>
              <h4>Status</h4>
              <p>{project.status}</p>
            </div>
          </div>

          <div className="project-card">
            <CalendarDays size={20} />
            <div>
              <h4>Deadline</h4>
              <p>
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString()
                  : "No Deadline"}
              </p>
            </div>
          </div>

          <div className="project-card">
            <CheckCircle size={20} />
            <div>
              <h4>Progress</h4>
              <p>{project.progress}%</p>
            </div>
          </div>

          <div className="project-card">
            <Users size={20} />
            <div>
              <h4>Team Members</h4>
              <p>{project.members?.length || 1}</p>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <section className="project-section">
          <h2>Description</h2>
          <p>{project.description || "No description added."}</p>
        </section>

        {/* KANBAN BOARD */}
        <section className="kanban-section">
          <h2>Task Board</h2>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
              {project.lists.map((list) => (
                <Droppable
                  key={list.id}
                  droppableId={String(list.id)}
                >
                  {(provided) => (
                    <div
                      className="kanban-column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="kanban-header">
                        <h3>
                          {list.title} ({list.cards.length})
                        </h3>
                        <Trash2
                          size={18}
                          className="delete-list-icon"
                          onClick={() => deleteList(list.id)}
                        />
                      </div>

                      {list.cards.map((card, index) => (
                        <Draggable
                          key={card.id}
                          draggableId={String(card.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`kanban-task 
                                ${snapshot.isDragging ? "dragging" : ""} 
                                ${card.dueDate &&
                                  new Date(card.dueDate) < new Date()
                                  ? "overdue"
                                  : ""
                                }
                                ${card.completed ? "completed" : ""}
                              `}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openCard(card)}
                            >
                              <div className="card-top-row">
                                {/* DONE / NOT DONE CHECKBOX */}
                                <input
                                  type="checkbox"
                                  checked={!!card.completed}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    updateCardCompleted(
                                      card.id,
                                      list.id,
                                      e.target.checked
                                    );
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />

                                {/* LABELS ON CARD */}
                                <div className="card-labels-preview">
                                  {(card.labels || []).map((l) => (
                                    <span
                                      key={l.id}
                                      className="label-mini"
                                      style={{ background: l.label.color }}
                                    ></span>
                                  ))}
                                </div>
                              </div>

                              <div className="card-title-row">
                                <strong>{card.title}</strong>

                                {card.priority && (
                                  <span className={`priority-badge ${card.priority.toLowerCase()}`}>
                                    {card.priority}
                                  </span>
                                )}
                              </div>


                              {/* DUE DATE BELOW TITLE */}
                              {card.dueDate && (
                                <p className="due-date-text">
                                  📅{" "}
                                  {new Date(card.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}

                      <button
                        className="add-task-btn"
                        onClick={() => {
                          setCurrentList(list.id);
                          setShowTaskModal(true);
                        }}
                      >
                        + Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              ))}

              {/* ADD LIST */}
              <div
                className="add-list-card"
                onClick={() => setShowListModal(true)}
              >
                + Add New List
              </div>
            </div>
          </DragDropContext>
        </section>
      </main>

      {/* ---------------------------------------------------------
                LIST MODAL
      ---------------------------------------------------------- */}
      {showListModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create New List</h2>
            <input
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowListModal(false)}>
                Cancel
              </button>
              <button className="create-btn-modal" onClick={createList}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------
                TASK MODAL
      ---------------------------------------------------------- */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add Task</h2>

            <input
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowTaskModal(false)}>
                Cancel
              </button>
              <button className="create-btn-modal" onClick={createTask}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------
                CARD DETAILS MODAL
      ---------------------------------------------------------- */}
      {showCardModal && cardDetails && (
        <div className="task-modal-overlay">
          <div className="task-modal">

            {/* HEADER */}
            <div className="task-modal-header">
              <input
                className="task-title-input"
                value={cardDetails.title}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, title: e.target.value })
                }
                onBlur={updateCardTitle}
              />

              <button className="delete-task-btn" onClick={deleteTask}>
                Delete
              </button>

              <X className="close-modal" onClick={() => setShowCardModal(false)} />
            </div>

            {/* BODY */}
            <div className="task-modal-body">

              {/* STATUS TOGGLE */}
              <section className="status-section">
                <h3>Status</h3>
                <label className="status-toggle">
                  <input
                    type="checkbox"
                    checked={!!cardDetails.completed}
                    onChange={(e) =>
                      updateCardCompleted(
                        cardDetails.id,
                        cardDetails.listId,
                        e.target.checked
                      )
                    }
                  />
                  <span>{cardDetails.completed ? "Done" : "Mark as done"}</span>
                </label>
              </section>

              {/* DESCRIPTION */}
              <section>
                <h3>Description</h3>
                <textarea
                  className="desc-input"
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  onBlur={saveDescription}
                />
              </section>
              {/* PRIORITY */}
              <section>
                <h3>Priority</h3>

                <select
                  className="priority-select"
                  value={cardDetails.priority || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    setCardDetails({ ...cardDetails, priority: value });

                    fetch(`http://localhost:3000/api/cards/${activeCard.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ priority: value }),
                    });

                    // Update board preview
                    setProject({
                      ...project,
                      lists: project.lists.map((list) =>
                        list.id === activeCard.listId
                          ? {
                            ...list,
                            cards: list.cards.map((c) =>
                              c.id === activeCard.id ? { ...c, priority: value } : c
                            ),
                          }
                          : list
                      ),
                    });
                  }}
                >
                  <option value="">No Priority</option>
                  <option value="High">🔥 High</option>
                  <option value="Medium">⚠️ Medium</option>
                  <option value="Low">⬇️ Low</option>
                </select>
              </section>


              {/* DUE DATE */}
              <section>
                <h3>Due Date</h3>

                <input
                  type="date"
                  className="due-date-input"
                  value={
                    cardDetails.dueDate
                      ? new Date(cardDetails.dueDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value;
                    setCardDetails({ ...cardDetails, dueDate: date });

                    fetch(`http://localhost:3000/api/cards/${activeCard.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ dueDate: date }),
                    });
                  }}
                />
              </section>

              {/* LABELS */}
              <section>
                <h3>Labels</h3>

                <div className="labels-row">
                  {cardDetails.labels.map((l) => (
                    <span
                      key={l.labelId}
                      className="label-chip"
                      style={{ background: l.label.color }}
                      onClick={() => removeLabel(l.labelId)}
                    >
                      {l.label.name} ✕
                    </span>
                  ))}
                </div>

                <div className="label-picker">
                  {project.labels.map((label) => (
                    <div
                      key={label.id}
                      className="label-option"
                      style={{ background: label.color }}
                      onClick={() => assignLabel(label.id)}
                    >
                      {label.name}
                    </div>
                  ))}
                </div>
              </section>

              {/* COMMENTS */}
              <section>
                <h3>Comments</h3>

                <div className="add-comment-row">
                  <input
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <button onClick={addComment}>Post</button>
                </div>

                <div className="comments-list">
                  {cardDetails.comments?.map((c) => (
                    <div key={c.id} className="comment-item">
                      <p><strong>{c.user.name}</strong></p>
                      <p>{c.content}</p>

                      <X
                        className="delete-comment"
                        onClick={() => deleteComment(c.id)}
                      />
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetails;
