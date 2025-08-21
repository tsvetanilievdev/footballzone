import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'Поне 8 символа',
    test: (password) => password.length >= 8
  },
  {
    label: 'Поне една главна буква (A-Z)',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: 'Поне една малка буква (a-z)',
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: 'Поне една цифра (0-9)',
    test: (password) => /[0-9]/.test(password)
  },
  {
    label: 'Поне един специален символ (!@#$%^&*(),.?":{}|<>)',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
];

interface PasswordRequirementsProps {
  password: string;
  className?: string;
  show?: boolean;
}

export default function PasswordRequirements({ password, className = '', show = true }: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 ${className}`}>
      <p className="text-sm font-medium text-gray-700 mb-3">Изисквания за паролата:</p>
      <ul className="space-y-2">
        {passwordRequirements.map((requirement, index) => {
          const isValid = requirement.test(password);
          return (
            <li key={index} className="flex items-center text-sm">
              {isValid ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              )}
              <span className={isValid ? 'text-green-700' : 'text-gray-600'}>
                {requirement.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function isPasswordValid(password: string): boolean {
  return passwordRequirements.every(req => req.test(password));
}