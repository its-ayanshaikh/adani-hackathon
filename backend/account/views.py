from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login, logout
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import RegisterSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"success": True, "message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_tokens_for_user(user):
    """
    Helper function to generate JWT tokens for user
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        username = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"success": False, "message": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"success": False, "message": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"success": False, "message": "Your account is inactive"},
                status=status.HTTP_403_FORBIDDEN
            )

        tokens = get_tokens_for_user(user)

        return Response(
            {
                "success": True,
                "message": "Login successful",
                "data": {
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type,
                },
                "tokens": tokens
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print(e)
        return Response(
            {"success": False, "message": "Something went wrong", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"success": False, "message": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"success": True, "message": "Logout successful"},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"success": False, "message": "Invalid token", "error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    try:
        user = request.user

        return Response(
            {
                "success": True,
                "message": "Profile fetched successfully",
                "data": {
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type,
                },
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"success": False, "message": "Something went wrong", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
