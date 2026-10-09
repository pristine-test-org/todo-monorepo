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


  const remaining = todos.filter((t) => !t.done).length;

  return (
    <main className="page">
      <header className="head">
        <h1 className="wordmark">
          <span className="prompt" aria-hidden="true">~/</span>tally-lite
        </h1>
        {status === "ready" && todos.length > 0 && (
          <p className="count">
            <strong>{remaining}</strong>/{todos.length} open
          </p>
        )}
      </header>

      <form className="composer" onSubmit={addTodo}>
        <label className="sr-only" htmlFor="new-todo">
          New item
        </label>
        <span className="caret" aria-hidden="true">
          &gt;
        </span>
        <input
          id="new-todo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="type a task, press enter"
          maxLength={200}
          autoComplete="off"
          disabled={!supabase}
        />
        <button type="submit" disabled={!supabase || saving || !title.trim()}>
          {saving ? "[adding]" : "[add]"}
        </button>
      </form>

      {error && (
        <div className="notice" role="alert" data-state="error">
          <p>! {error}</p>
          {supabase && status === "error" && (
            <button type="button" className="quiet" onClick={() => void load()}>
              [try again]
            </button>
          )}
        </div>
      )}

      {status === "loading" && (
        <p className="state" data-state="loading" aria-live="polite">
          loading…
        </p>
      )}

      {status === "ready" && todos.length === 0 && (
        <div className="state" data-state="empty">
          <p>-- empty --</p>
          <p>Nothing to do. Type one above.</p>
        </div>
      )}

      {status === "ready" && todos.length > 0 && (
        <ol className="list">
          {todos.map((todo) => (
            <li key={todo.id} className="item" data-done={todo.done}>
              <label>
                <input type="checkbox" checked={todo.done} onChange={() => void toggleTodo(todo)} />
                <span className="box" aria-hidden="true">
                  {todo.done ? "[x]" : "[ ]"}
                </span>
                <span className="text">{todo.title}</span>
              </label>
              <button
                type="button"
                className="remove"
                onClick={() => void deleteTodo(todo)}
                aria-label={`Remove "${todo.title}"`}
              >
                rm
              </button>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
