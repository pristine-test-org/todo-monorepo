import { useCallback, useEffect, useState, type FormEvent } from "react";
import { missingConfig, supabase, type Todo } from "./lib/supabase.ts";

type Status = "loading" | "ready" | "error";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(missingConfig ? "error" : "loading");
  const [error, setError] = useState<string | null>(missingConfig);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    setStatus("loading");
    const { data, error } = await supabase
      .from("todos")
      .select("id, title, done, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      setError("We couldn't load your list. Check your connection and try again.");
      setStatus("error");
      return;
    }
    setTodos(data ?? []);
    setError(null);
    setStatus("ready");
  }, []);

  useEffect(() => {
    // Fetching on mount is the point of this effect; load() sets state once the request settles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function addTodo(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!supabase || !trimmed) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("todos")
      .insert({ title: trimmed })
      .select("id, title, done, created_at")
      .single();
    setSaving(false);
    if (error || !data) {
      setError("That one didn't save. Try again.");
      return;
    }
    setTodos((current) => [data, ...current]);
    setTitle("");
    setError(null);
  }

  async function toggleTodo(todo: Todo) {
    if (!supabase) return;
    setTodos((current) => current.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)));
    const { error } = await supabase.from("todos").update({ done: !todo.done }).eq("id", todo.id);
    if (error) {
      setTodos((current) => current.map((t) => (t.id === todo.id ? { ...t, done: todo.done } : t)));
      setError("We couldn't update that item. Try again.");
    }
  }

  async function deleteTodo(todo: Todo) {
    if (!supabase) return;
    const previous = todos;
    setTodos((current) => current.filter((t) => t.id !== todo.id));
    const { error } = await supabase.from("todos").delete().eq("id", todo.id);
    if (error) {
      setTodos(previous);
      setError("We couldn't remove that item. Try again.");
    }
  }


  const open = todos.filter((t) => !t.done);
  const finished = todos.filter((t) => t.done);
  const columns = [
    { key: "open", title: "To do", items: open, empty: "Nothing waiting. Add a card above." },
    { key: "done", title: "Done", items: finished, empty: "Finished cards land here." },
  ];

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <h1 className="wordmark">Tally Board</h1>
        </div>
        {status === "ready" && todos.length > 0 && (
          <p className="count">
            <strong>{open.length}</strong> open · <strong>{finished.length}</strong> done
          </p>
        )}
      </header>

      <main className="board-page">
        <form className="composer" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="new-todo">
            New card
          </label>
          <input
            id="new-todo"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a card to To do"
            maxLength={200}
            autoComplete="off"
            disabled={!supabase}
          />
          <button type="submit" disabled={!supabase || saving || !title.trim()}>
            {saving ? "Adding…" : "Add card"}
          </button>
        </form>

        {error && (
          <div className="notice" role="alert" data-state="error">
            <p>{error}</p>
            {supabase && status === "error" && (
              <button type="button" className="quiet" onClick={() => void load()}>
                Try again
              </button>
            )}
          </div>
        )}

        {status === "loading" && (
          <p className="state" data-state="loading" aria-live="polite">
            Loading the board…
          </p>
        )}

        {status === "ready" && todos.length === 0 && (
          <div className="state" data-state="empty">
            <p className="state-title">An empty board.</p>
            <p>Add your first card above.</p>
          </div>
        )}

        {status === "ready" && todos.length > 0 && (
          <div className="board">
            {columns.map((column) => (
              <section key={column.key} className="column" data-column={column.key} aria-labelledby={`col-${column.key}`}>
                <h2 className="column-title" id={`col-${column.key}`}>
                  {column.title}
                  <span className="column-count">{column.items.length}</span>
                </h2>
                {column.items.length === 0 ? (
                  <p className="column-empty">{column.empty}</p>
                ) : (
                  <ul className="cards">
                    {column.items.map((todo) => (
                      <li key={todo.id} className="card" data-done={todo.done}>
                        <p className="card-title">{todo.title}</p>
                        <div className="card-actions">
                          <button type="button" className="move" onClick={() => void toggleTodo(todo)}>
                            {todo.done ? "Reopen" : "Mark done"}
                          </button>
                          <button
                            type="button"
                            className="remove"
                            onClick={() => void deleteTodo(todo)}
                            aria-label={`Remove "${todo.title}"`}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        <p>
          <a href="/impeccable-test-drive.html">Design test drive</a>
        </p>
      </main>
    </div>
  );
}
