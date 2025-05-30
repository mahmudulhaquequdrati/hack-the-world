import type { RootState } from "@/app/store";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";
import { clearAuth, setCredentials } from "@/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthLoader = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  // Only fetch user if we have a token but no user data
  const shouldFetchUser = Boolean(token && !user);

  const { data: userData, error: userError } = useGetCurrentUserQuery(
    undefined,
    {
      skip: !shouldFetchUser,
    }
  );

  useEffect(() => {
    if (userData && token) {
      // Update Redux with fetched user data
      dispatch(
        setCredentials({
          user: userData.data.user,
          token,
        })
      );
    }
  }, [userData, token, dispatch]);

  useEffect(() => {
    if (userError && token) {
      // If we can't fetch user data with a valid token, clear auth
      console.warn("Failed to fetch user data, clearing authentication");
      dispatch(clearAuth());
    }
  }, [userError, token, dispatch]);

  // This component doesn't render anything
  return null;
};

export default AuthLoader;
