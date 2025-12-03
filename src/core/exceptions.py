from fastapi import HTTPException, status

class UserNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

class InvalidCredentialsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

class DuplicateUserException(HTTPException):
    def __init__(self, detail: str = "Email or username already registered"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
        )

class MemoryCardNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory card not found",
        )

class AttachmentNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attachment not found",
        )

class UnauthorizedAccessException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource",
        )
