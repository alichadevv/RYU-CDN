import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;

  // Check if the request expects JSON
  const isApiRequest =
    req.path.startsWith("/api") || req.headers.accept === "application/json";

  if (isApiRequest) {
    // Return JSON error for API requests
    res.status(statusCode).json({
      status: statusCode,
      message: err.message || "Internal Server Error",
      creator: "RyuIzumi.",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  } else {
    // Render error page for web requests
    res.status(statusCode).render("error", {
      title: `${statusCode} - Error | RYU CDN`,
      message: err.message || "Something went wrong",
      statusCode,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

/**
 * 404 handler middleware
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Check if the request expects JSON
  const isApiRequest =
    req.path.startsWith("/api") || req.headers.accept === "application/json";

  if (isApiRequest) {
    // Return JSON 404 for API requests
    res.status(404).json({
      status: 404,
      message: "Route not found",
      creator: "RyuIzumi.",
    });
  } else {
    // Render 404 page for web requests
    res.status(404).render("error", {
      title: "404 - Not Found | RYU CDN",
      message: "The page you are looking for does not exist.",
      statusCode: 404,
    });
  }
};
