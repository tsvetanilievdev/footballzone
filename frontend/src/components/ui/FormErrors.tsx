import { 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  ShieldExclamationIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ParsedValidationError, getFieldDisplayName } from '@/utils/errorUtils';

interface FormErrorsProps {
  errors: ParsedValidationError[];
  className?: string;
  showFieldNames?: boolean;
  groupByType?: boolean;
}

export default function FormErrors({ 
  errors, 
  className = '', 
  showFieldNames = false,
  groupByType = false 
}: FormErrorsProps) {
  if (!errors || errors.length === 0) return null;

  // Get appropriate styling based on severity and type
  const getErrorStyles = (error: ParsedValidationError) => {
    const baseStyles = 'rounded-xl p-4';
    
    switch (error.severity) {
      case 'warning':
        return `${baseStyles} bg-yellow-50 border border-yellow-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 border border-blue-200`;
      default: // error
        switch (error.type) {
          case 'permission':
            return `${baseStyles} bg-orange-50 border border-orange-200`;
          case 'server':
            return `${baseStyles} bg-purple-50 border border-purple-200`;
          default:
            return `${baseStyles} bg-red-50 border border-red-200`;
        }
    }
  };

  const getErrorIcon = (error: ParsedValidationError) => {
    const iconClass = "h-5 w-5 mr-3 flex-shrink-0";
    
    switch (error.severity) {
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-400`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-400`} />;
      default: // error
        switch (error.type) {
          case 'permission':
            return <ShieldExclamationIcon className={`${iconClass} text-orange-400`} />;
          case 'server':
            return <ClockIcon className={`${iconClass} text-purple-400`} />;
          case 'required':
            return <DocumentTextIcon className={`${iconClass} text-red-400`} />;
          default:
            return <XCircleIcon className={`${iconClass} text-red-400`} />;
        }
    }
  };

  const getErrorTextColor = (error: ParsedValidationError) => {
    switch (error.severity) {
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default: // error
        switch (error.type) {
          case 'permission':
            return 'text-orange-700';
          case 'server':
            return 'text-purple-700';
          default:
            return 'text-red-600';
        }
    }
  };

  // Group errors by type if requested
  if (groupByType) {
    const groupedErrors: Record<string, ParsedValidationError[]> = {};
    errors.forEach(error => {
      const type = error.type || 'validation';
      if (!groupedErrors[type]) groupedErrors[type] = [];
      groupedErrors[type].push(error);
    });

    const typeLabels: Record<string, string> = {
      required: 'Задължителни полета',
      format: 'Формат на данните',
      duplicate: 'Дублирани записи', 
      length: 'Дължина на текста',
      permission: 'Права за достъп',
      server: 'Системни грешки',
      validation: 'Грешки при валидация'
    };

    return (
      <div className={`space-y-3 ${className}`}>
        {Object.entries(groupedErrors).map(([type, typeErrors]) => (
          <div key={type} className={getErrorStyles(typeErrors[0])}>
            <div className="flex items-start">
              {getErrorIcon(typeErrors[0])}
              <div className="flex-1">
                <h4 className={`text-sm font-medium mb-2 ${getErrorTextColor(typeErrors[0])}`}>
                  {typeLabels[type] || 'Грешки'}
                </h4>
                <ul className="space-y-1">
                  {typeErrors.map((error, index) => (
                    <li key={index} className={`text-sm ${getErrorTextColor(error)} flex items-start`}>
                      <span className="inline-block w-1.5 h-1.5 bg-current rounded-full mr-2 mt-2 flex-shrink-0 opacity-60"></span>
                      <span>
                        {showFieldNames && error.field !== 'general' && (
                          <span className="font-medium">{getFieldDisplayName(error.field)}: </span>
                        )}
                        {error.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If only one general error, show simple format
  if (errors.length === 1 && errors[0].field === 'general') {
    const error = errors[0];
    return (
      <div className={`${getErrorStyles(error)} ${className}`}>
        <div className="flex items-center">
          {getErrorIcon(error)}
          <div className={`text-sm ${getErrorTextColor(error)}`}>
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  // Multiple field errors - show structured format
  const primaryError = errors[0];
  return (
    <div className={`${getErrorStyles(primaryError)} ${className}`}>
      <div className="flex items-start">
        {getErrorIcon(primaryError)}
        <div className="flex-1">
          <h3 className={`text-sm font-medium mb-2 ${getErrorTextColor(primaryError)}`}>
            Моля, поправете следните грешки:
          </h3>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className={`text-sm ${getErrorTextColor(error)} flex items-start`}>
                <span className="inline-block w-1.5 h-1.5 bg-current rounded-full mr-2 mt-2 flex-shrink-0 opacity-60"></span>
                <span>
                  {showFieldNames && error.field !== 'general' && (
                    <span className="font-medium">{getFieldDisplayName(error.field)}: </span>
                  )}
                  {error.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className = '' }: FieldErrorProps) {
  if (!message) return null;
  
  return (
    <p className={`text-sm text-red-600 mt-1 flex items-center ${className}`}>
      <XCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
      {message}
    </p>
  );
}