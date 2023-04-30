import "./styles.css";
import { useState, useEffect } from "react";
import * as swal from "sweetalert2";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [crashedOut, setCrashedOut] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNote, setEditedNote] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");


  useEffect(() => {
    const existingNotes = JSON.parse(
      localStorage.getItem("notes") || "[]"
    ).sort((a, b) => {
      if (sortOrder === "asc") {
        return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1;
      }
      return a.text.toLowerCase() < b.text.toLowerCase() ? 1 : -1;
    });

    const existingCrashedOut = JSON.parse(
      localStorage.getItem("crashedOut") || "[]"
    );
    setNotes(existingNotes);
    setCrashedOut(existingCrashedOut);
  }, [sortOrder]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem("notes", JSON.stringify(notes));
      localStorage.setItem("crashedOut", JSON.stringify(crashedOut));
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [notes, crashedOut]);

  const handleChange = (event) => {
    setNote(event.target.value);
  };

  const handleEditChange = (event) => {
    setEditedNote(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!note) {
      swal.fire({
        title: "Error!",
        text: "Please enter a task",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    } else {
      const newNote = {
        id: Date.now(),
        text: note,
        createdAt: new Date(),
      };

      const updatedNotes = [...notes, newNote].sort((a, b) => {
        if (sortOrder === "asc") {
          return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1;
        }
        return a.text.toLowerCase() < b.text.toLowerCase() ? 1 : -1;
      });
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setNote("");

      await swal.fire({
        title: "Task Added",
        text: "Your note has been added",
        icon: "success",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const [checkedNoteId, setCheckedNoteId] = useState(null);

  const handleApply = (id) => {
    const updatedNotes = notes.filter(
      (updatedNote) => updatedNote.id !== id
    ).sort((a, b) => {
      if (sortOrder === "asc") {
        return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1;
      }
      return a.text.toLowerCase() < b.text.toLowerCase() ? 1 : -1;
    });
    const noteToRemove = notes.find((updatedNote) => updatedNote.id === id);
    setCrashedOut([...crashedOut, noteToRemove.text]);
    setNotes(updatedNotes);
    setCheckedNoteId(null);
  };

  const handleDelete = (text) => {
    setCrashedOut(crashedOut.filter((crashedOutText) => crashedOutText !== text));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredNotes = notes.filter((updatedNote) =>
    updatedNote.text.includes(searchQuery)
  );

  const handleEdit = (id, currentNote) => {
    setEditingNoteId(id);
    setEditedNote(currentNote);
  };

  const handleEditSubmit = (id) => {
    const editedNotes = notes.map((note) => {
      if (note.id === id) {
        swal.fire({
          title: "Task Edited",
          text: "Task has been edited",
          icon: "success",
        });
        return {
          ...note,
          text: editedNote,
        };
      } else {
        return note;
      }
    });
    setNotes(editedNotes);
    setEditingNoteId(null);
    setEditedNote("");
  };

  const handleSort = () => {
    if (sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
  };

  const sortedNotes = filteredNotes.sort((a, b) =>
    sortOrder === "desc" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  );

  return (
    <div>
      <nav className="navigation">
        <a href="/" className="brand-name">
          Todo Notes
        </a>

        <input
          className="textbox"
          type="text"
          name="searchNote"
          placeholder="Search Tasks Here"
          value={searchQuery}
          onChange={handleSearch}
        />
      </nav>

      <div className="container">
        <article>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="add-task">
                <input
                  className="textbox"
                  type="text"
                  name="note"
                  placeholder="Add Task Here"
                  value={note}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <button className="submit" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>

          <div className="sort-order">
            <button className="sort-desc" onClick={handleSort}>
              {sortOrder === "desc" ? "Sort by Date ⬆" : "Sort by Date ⬇"}
            </button>
            <button className="sort-asc" onClick={handleSort}>
              {sortOrder === "desc" ? "Sort by Name ⬇" : "Sort by Name ⬆"}
            </button>
          </div>


        </article>
      </div>

      <div className="grid-wrapper">
        <div className="grid">
          <div className="card">
            {sortedNotes.length === 0 && (
              <div className="card-content">No Tasks Found</div>
            )}
            {sortedNotes.map((updatedNote, index) => (
              <div
                key={index}
                className={
                  updatedNote.applied ? "card-content applied" : "card-content"
                }
              >
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  checked={checkedNoteId === updatedNote.id}
                  onChange={() => { }}
                  onClick={() => {
                    if (checkedNoteId === updatedNote.id) {
                      setCheckedNoteId("");
                    } else {
                      setCheckedNoteId(updatedNote.id);
                    }
                  }}
                />
                {editingNoteId === updatedNote.id ? (
                  <input
                    className="edit-textbox"
                    type="text"
                    name="editedNote"
                    value={editedNote}
                    onChange={handleEditChange}
                  />
                ) : (
                  <>
                    <label htmlFor={`checkbox-${index}`}>
                      {JSON.stringify(updatedNote.text)}
                    </label>
                    <span>{(new Date(updatedNote.createdAt)).toLocaleString()}</span>
                  </>
                )}
                {checkedNoteId === updatedNote.id && (
                  <div className="card-footer">
                    {editingNoteId === updatedNote.id ? (
                      <button
                        className="save-task"
                        onClick={() => handleEditSubmit(updatedNote.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(updatedNote.id, updatedNote.text)
                        }
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="apply-btn"
                      onClick={() => handleApply(updatedNote.id)}
                    >
                      Mark As Done
                    </button>
                  </div>
                )}
              </div>
            ))}


          </div>
        </div>
      </div>

      <div className="card comp">
        <div className="card-header">
          <h3>Completed Tasks</h3>
        </div>
        <div className="card-body">
          {crashedOut.length === 0 && ("No Tasks Found")}
          {crashedOut.map((text, index) => (
            <div className="crashed-out-item" key={index}>
              <span className="strikeout">{text}</span>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(text)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="card-footer">

          {crashedOut.length !== 0 && (
            <div>
              <p>Total: {crashedOut.length}</p>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}

export default App;
