import { useNavigate, useSearchParams } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()

  return {
    push: navigate,
    replace: (path) => navigate(path, { replace: true }),
  }
}

export { useSearchParams }
