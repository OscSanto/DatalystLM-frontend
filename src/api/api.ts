import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  Topic,
  Difficulty,
  QuestionResponse,
  AnswerRequest,
  FeedbackResponse,
  HistoryItem,
} from "../types/types";

const BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// For unauthenticated endpoints (login, register) — never redirects on 401
async function handleAuthResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// For authenticated endpoints — 401 means session expired, clear and redirect
async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    localStorage.removeItem("datalystlm_token");
    localStorage.removeItem("datalystlm_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleAuthResponse<AuthResponse>(res);
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleAuthResponse<AuthResponse>(res);
}

export async function getQuestion(
  topic: Topic,
  difficulty: Difficulty | null,
  token: string
): Promise<QuestionResponse> {
  const params = new URLSearchParams({ topic });
  if (difficulty) params.set("difficulty", difficulty);
  const res = await fetch(`${BASE}/practice/question?${params}`, {
    headers: authHeaders(token),
  });
  return handleResponse<QuestionResponse>(res);
}

export async function evaluate(
  data: AnswerRequest,
  token: string
): Promise<FeedbackResponse> {
  const res = await fetch(`${BASE}/practice/evaluate`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse<FeedbackResponse>(res);
}

export async function getHistory(token: string): Promise<HistoryItem[]> {
  const res = await fetch(`${BASE}/practice/history`, {
    headers: authHeaders(token),
  });
  return handleResponse<HistoryItem[]>(res);
}
