export interface ParsedValidationError {
  field: string;
  message: string;
  type?: 'validation' | 'required' | 'format' | 'duplicate' | 'length' | 'permission' | 'server';
  severity?: 'error' | 'warning' | 'info';
}

export interface ErrorContext {
  form?: 'registration' | 'login' | 'article' | 'media' | 'profile' | 'general';
  action?: 'create' | 'update' | 'delete' | 'upload' | 'login' | 'register';
}

export function parseValidationErrors(
  errorMessage: string, 
  context?: ErrorContext
): ParsedValidationError[] {
  if (!errorMessage) {
    return [];
  }

  // Handle different error formats
  const errors: ParsedValidationError[] = [];

  // 1. Handle Zod validation format: "Validation failed: body.field: message"
  if (errorMessage.includes('Validation failed:')) {
    return parseZodValidationErrors(errorMessage, context);
  }

  // 2. Handle HTTP status errors
  if (errorMessage.match(/^(HTTP )?\d{3}:/)) {
    return parseHttpErrors(errorMessage, context);
  }

  // 3. Handle JSON error objects
  try {
    const parsed = JSON.parse(errorMessage);
    if (parsed.errors || parsed.validationErrors) {
      return parseJsonErrors(parsed, context);
    }
  } catch {
    // Not JSON, continue with other parsing
  }

  // 4. Handle common database/API errors (security-safe)
  if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
    return [{
      field: 'general',
      message: getContextualMessage('duplicate', context),
      type: 'duplicate',
      severity: 'error'
    }];
  }

  // Security: Don't expose detailed auth error info
  if (errorMessage.includes('unauthorized') || errorMessage.includes('403') || errorMessage.includes('401')) {
    return [{
      field: 'general',
      message: 'Нямате права за това действие.',
      type: 'permission',
      severity: 'error'
    }];
  }

  // Security: Generic server errors without exposing internal details
  if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND') || errorMessage.includes('timeout')) {
    return [{
      field: 'general',
      message: 'Услугата временно не е достъпна. Моля, опитайте отново.',
      type: 'server',
      severity: 'error'
    }];
  }

  // Security: Don't expose database schema or internal errors
  if (errorMessage.includes('SQL') || errorMessage.includes('database') || errorMessage.includes('relation') || errorMessage.includes('constraint')) {
    return [{
      field: 'general',
      message: 'Възникна техническа грешка. Моля, опитайте отново.',
      type: 'server',
      severity: 'error'
    }];
  }

  // 5. Handle network errors
  if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
    return [{
      field: 'general',
      message: 'Проблем с мрежата. Моля, проверете интернет връзката.',
      type: 'server',
      severity: 'error'
    }];
  }

  // 6. Default case - treat as general error
  return [{
    field: 'general',
    message: getUserFriendlyMessage('general', errorMessage, context),
    type: 'server',
    severity: 'error'
  }];
}

function parseZodValidationErrors(errorMessage: string, context?: ErrorContext): ParsedValidationError[] {
  const errors: ParsedValidationError[] = [];
  
  // Split by comma to get individual field errors
  const validationPart = errorMessage.split('Validation failed: ')[1];
  const fieldErrors = validationPart.split(', body.');
  
  fieldErrors.forEach((error, index) => {
    let cleanError = error;
    // Add 'body.' prefix back for non-first items
    if (index > 0) {
      cleanError = 'body.' + cleanError;
    }
    
    // Extract field and message
    const parts = cleanError.split(': ');
    if (parts.length >= 2) {
      const fieldPath = parts[0].replace('body.', '');
      const message = parts.slice(1).join(': ');
      errors.push({ 
        field: fieldPath, 
        message: getUserFriendlyMessage(fieldPath, message, context),
        type: getErrorType(message),
        severity: 'error'
      });
    }
  });

  return errors.length > 0 ? errors : [{ field: 'general', message: errorMessage, type: 'validation', severity: 'error' }];
}

function parseHttpErrors(errorMessage: string, context?: ErrorContext): ParsedValidationError[] {
  if (errorMessage.includes('400')) {
    return [{
      field: 'general',
      message: getContextualMessage('badRequest', context),
      type: 'validation',
      severity: 'error'
    }];
  }
  
  if (errorMessage.includes('404')) {
    return [{
      field: 'general',
      message: getContextualMessage('notFound', context),
      type: 'server',
      severity: 'error'
    }];
  }

  if (errorMessage.includes('500')) {
    return [{
      field: 'general',
      message: 'Сървърна грешка. Моля, опитайте отново по-късно.',
      type: 'server',
      severity: 'error'
    }];
  }

  return [{
    field: 'general',
    message: errorMessage,
    type: 'server',
    severity: 'error'
  }];
}

function parseJsonErrors(parsed: any, context?: ErrorContext): ParsedValidationError[] {
  const errors: ParsedValidationError[] = [];
  
  // Handle array of errors
  const errorArray = parsed.errors || parsed.validationErrors || [];
  
  if (Array.isArray(errorArray)) {
    errorArray.forEach((err: any) => {
      errors.push({
        field: err.field || err.path || 'general',
        message: getUserFriendlyMessage(err.field || 'general', err.message, context),
        type: getErrorType(err.message || err.type),
        severity: err.severity || 'error'
      });
    });
  }

  return errors.length > 0 ? errors : [{
    field: 'general',
    message: parsed.message || 'Възникна грешка',
    type: 'server',
    severity: 'error'
  }];
}

function getErrorType(message: string): ParsedValidationError['type'] {
  if (message.includes('required') || message.includes('mandatory')) return 'required';
  if (message.includes('format') || message.includes('invalid')) return 'format';
  if (message.includes('duplicate') || message.includes('exists')) return 'duplicate';
  if (message.includes('length') || message.includes('characters')) return 'length';
  if (message.includes('unauthorized') || message.includes('permission')) return 'permission';
  return 'validation';
}

function getContextualMessage(errorType: string, context?: ErrorContext): string {
  const contextualMessages: Record<string, Record<string, string>> = {
    duplicate: {
      registration: 'Този имейл вече се използва. Моля, използвайте друг или влезте в съществуващия акаунт.',
      article: 'Статия с това заглавие или slug вече съществува.',
      media: 'Файл с това име вече съществува.',
      general: 'Този запис вече съществува в системата.'
    },
    unauthorized: {
      article: 'Нямате права да създавате или редактирате статии.',
      media: 'Нямате права за качване на файлове.',
      general: 'Нямате права за това действие.'
    },
    badRequest: {
      registration: 'Моля, попълнете всички полета правилно.',
      article: 'Моля, проверете въведената информация за статията.',
      general: 'Заявката съдържа грешки. Моля, проверете въведените данни.'
    },
    notFound: {
      article: 'Статията не беше намерена.',
      media: 'Файлът не беше намерен.',
      general: 'Търсеният ресурс не беше намерен.'
    }
  };

  return contextualMessages[errorType]?.[context?.form || 'general'] || 
         contextualMessages[errorType]?.['general'] || 
         'Възникна неочаквана грешка.';
}

function getUserFriendlyMessage(field: string, originalMessage: string, context?: ErrorContext): string {
  const friendlyMessages: Record<string, Record<string, string>> = {
    // Authentication fields
    password: {
      'Password must contain at least one uppercase letter': 'Паролата трябва да съдържа поне една главна буква',
      'Password must contain at least one number': 'Паролата трябва да съдържа поне една цифра',
      'Password must contain at least one lowercase letter': 'Паролата трябва да съдържа поне една малка буква',
      'Password must be at least 8 characters long': 'Паролата трябва да бъде поне 8 символа',
      'Password must not exceed 128 characters': 'Паролата не може да бъде по-дълга от 128 символа',
      'Password must contain at least one special character': 'Паролата трябва да съдържа поне един специален символ (!@#$%^&*(),.?":{}|<>)',
      'Password is required': 'Паролата е задължителна',
      'Passwords do not match': 'Паролите не съвпадат',
      'Current password is required': 'Текущата парола е задължителна',
      'New passwords don\'t match': 'Новите пароли не съвпадат',
      'Password is required for 2FA setup': 'Паролата е задължителна за настройка на 2FA'
    },
    email: {
      'Invalid email address': 'Невалиден имейл адрес',
      'Invalid email format': 'Невалиден формат на имейл адреса',
      'Email already exists': 'Този имейл вече се използва',
      'Email is required': 'Имейлът е задължителен',
      'Email must be a valid email': 'Моля, въведете валиден имейл адрес',
      'Email must not exceed 255 characters': 'Имейлът не може да бъде по-дълъг от 255 символа'
    },
    name: {
      'Name is required': 'Името е задължително',
      'Name must be at least 2 characters long': 'Името трябва да бъде поне 2 символа',
      'Name must not exceed 100 characters': 'Името не може да бъде по-дълго от 100 символа',
      'Name contains invalid characters': 'Името съдържа невалидни символи (разрешени са само букви, тире и апострофи)',
      'Name must be at least 2 characters': 'Името трябва да бъде поне 2 символа',
      'Name must be less than 50 characters': 'Името не може да бъде по-дълго от 50 символа',
      'Invalid characters in name': 'Името съдържа невалидни символи'
    },
    firstName: {
      'First name is required': 'Името е задължително',
      'First name must be at least 2 characters': 'Името трябва да бъде поне 2 символа'
    },
    lastName: {
      'Last name is required': 'Фамилията е задължителна',
      'Last name must be at least 2 characters': 'Фамилията трябва да бъде поне 2 символа'
    },
    
    // Article fields
    title: {
      'Title is required': 'Заглавието е задължително',
      'String must contain at least 3 character(s)': 'Заглавието трябва да бъде поне 3 символа',
      'String must contain at most 255 character(s)': 'Заглавието не може да бъде по-дълго от 255 символа',
      'Title must be at least 3 characters': 'Заглавието трябва да бъде поне 3 символа',
      'Title must be less than 200 characters': 'Заглавието не може да бъде по-дълго от 200 символа',
      'Title already exists': 'Статия с това заглавие вече съществува',
      'Invalid characters in title': 'Заглавието съдържа невалидни символи'
    },
    excerpt: {
      'Excerpt is required': 'Краткото описание е задължително',
      'String must contain at most 500 character(s)': 'Краткото описание не може да бъде по-дълго от 500 символа',
      'Excerpt must be at least 10 characters': 'Краткото описание трябва да бъде поне 10 символа',
      'Excerpt must be less than 500 characters': 'Краткото описание не може да бъде по-дълго от 500 символа'
    },
    content: {
      'Content is required': 'Съдържанието е задължително',
      'String must contain at least 10 character(s)': 'Съдържанието трябва да бъде поне 10 символа',
      'Content must be at least 50 characters': 'Съдържанието трябва да бъде поне 50 символа',
      'Content is too long': 'Съдържанието е прекалено дълго'
    },
    slug: {
      'Slug is required': 'URL адресът (slug) е задължителен',
      'String must contain at least 3 character(s)': 'URL адресът трябва да бъде поне 3 символа',
      'String must contain at most 255 character(s)': 'URL адресът не може да бъде по-дълъг от 255 символа',
      'Invalid': 'URL адресът може да съдържа само малки букви, цифри и тире',
      'Invalid slug format': 'URL адресът може да съдържа само букви, цифри и тире',
      'Slug already exists': 'Статия с този URL адрес вече съществува',
      'Slug must be at least 3 characters': 'URL адресът трябва да бъде поне 3 символа'
    },
    category: {
      'Category is required': 'Категорията е задължителна',
      'Invalid category': 'Невалидна категория'
    },
    subcategory: {
      'Invalid subcategory': 'Невалидна подкategория'
    },
    featuredImage: {
      'Featured image is required': 'Основната снимка е задължителна',
      'Invalid image format': 'Невалиден формат на снимката',
      'Image size too large': 'Снимката е прекалено голяма',
      'Image upload failed': 'Качването на снимката неуспешно'
    },
    tags: {
      'Too many tags': 'Прекалено много тагове (максимум 10)',
      'Invalid tag format': 'Невалиден формат на таг',
      'Tag already exists': 'Този таг вече съществува'
    },
    authorName: {
      'Author name is required': 'Името на автора е задължително',
      'Author name must be at least 2 characters': 'Името на автора трябва да бъде поне 2 символа'
    },
    
    // Media fields
    file: {
      'File is required': 'Файлът е задължителен',
      'File size too large': 'Файлът е прекалено голям',
      'Invalid file type': 'Невалиден тип файл',
      'File upload failed': 'Качването на файла неуспешно',
      'File already exists': 'Файл с това име вече съществува'
    },
    filename: {
      'Filename is required': 'Името на файла е задължително',
      'Invalid filename': 'Невалидно име на файл'
    },
    
    // Zone and permission fields
    zones: {
      'At least one zone must be selected': 'Трябва да изберете поне една зона',
      'Invalid zone': 'Невалидна зона'
    },
    role: {
      'Role is required': 'Ролята е задължителна',
      'Invalid role': 'Невалидна роля'
    },
    
    // Authentication specific fields
    acceptTerms: {
      'You must accept the terms and conditions': 'Трябва да приемете условията за ползване',
      'Required': 'Приемането на условията е задължително'
    },
    subscribeNewsletter: {
      'Invalid value': 'Невалидна стойност за новини'
    },
    role: {
      'Role is required': 'Ролята е задължителна',
      'Invalid role': 'Невалидна роля',
      'Invalid enum value': 'Невалидна роля. Изберете от: Играч, Треньор, Родител'
    },
    refreshToken: {
      'Refresh token is required': 'Refresh token е задължителен',
      'Invalid refresh token': 'Невалиден refresh token'
    },
    currentPassword: {
      'Current password is required': 'Текущата парола е задължителна'
    },
    newPassword: {
      'New password is required': 'Новата парола е задължителна'
    },
    confirmPassword: {
      'Confirm password is required': 'Потвърждението на паролата е задължително',
      'Passwords don\'t match': 'Паролите не съвпадат',
      'New passwords don\'t match': 'Новите пароли не съвпадат'
    },
    token: {
      'Reset token is required': 'Reset token е задължителен',
      'Verification token is required': 'Verification token е задължителен',
      '2FA token must be 6 digits': '2FA кодът трябва да бъде 6 цифри',
      'Invalid token': 'Невалиден token'
    },
    
    // Advanced article fields
    readTime: {
      'Read time must be between 1 and 240 minutes': 'Времето за четене трябва да е между 1 и 240 минути',
      'Number must be greater than or equal to 1': 'Времето за четене трябва да е поне 1 минута',
      'Number must be less than or equal to 240': 'Времето за четене не може да бъде повече от 240 минути'
    },
    isPremium: {
      'Invalid premium status': 'Невалиден статус за премиум съдържание'
    },
    premiumReleaseDate: {
      'Invalid datetime string': 'Невалидна дата за освобождаване',
      'Premium release date must be in the future': 'Датата за освобождаване трябва да е в бъдещето'
    },
    templateId: {
      'Invalid template ID format': 'Невалиден формат на ID за темплейт',
      'Template not found': 'Темплейтът не беше намерен'
    },
    seriesId: {
      'Invalid series ID format': 'Невалиден формат на ID за серия',
      'Series not found': 'Серията не беше намерена'
    },
    seriesPart: {
      'Series part must be at least 1': 'Част от серията трябва да бъде поне 1',
      'Number must be greater than or equal to 1': 'Номерът на частта трябва да е поне 1'
    },
    status: {
      'Invalid status': 'Невалиден статус',
      'Invalid enum value': 'Невалиден статус. Изберете: Чернова, Публикувана, Архивирана, На преглед'
    },
    seoTitle: {
      'SEO title too long': 'SEO заглавието е прекалено дълго',
      'String must contain at most 255 character(s)': 'SEO заглавието не може да бъде по-дълго от 255 символа'
    },
    seoDescription: {
      'SEO description too long': 'SEO описанието е прекалено дълго',
      'String must contain at most 320 character(s)': 'SEO описанието не може да бъде по-дълго от 320 символа'
    },
    
    // Zone validation
    zone: {
      'Invalid zone': 'Невалидна зона',
      'Zone is required': 'Зоната е задължителна',
      'Invalid enum value': 'Невалидна зона. Изберете: Read, Coach, Player, Parent, Series'
    },
    visible: {
      'Visibility must be true or false': 'Видимостта трябва да е true или false'
    },
    requiresSubscription: {
      'Subscription requirement must be true or false': 'Изискването за абонамент трябва да е true или false'
    },
    freeAfterDate: {
      'Invalid datetime string': 'Невалидна дата за безплатен достъп',
      'Date must be in the future': 'Датата трябва да е в бъдещето'
    },
    zones: {
      'At least one zone must be selected': 'Трябва да изберете поне една зона',
      'Too many zones selected': 'Прекалено много зони (максимум 5)',
      'Array must contain at least 1 element(s)': 'Трябва да изберете поне една зона',
      'Array must contain at most 5 element(s)': 'Можете да изберете максимум 5 зони'
    },
    
    // Query parameters
    page: {
      'Page must be a positive number': 'Номерът на страницата трябва да е положително число',
      'Invalid page number': 'Невалиден номер на страница'
    },
    limit: {
      'Limit must be between 1 and 100': 'Лимитът трябва да е между 1 и 100',
      'Invalid limit': 'Невалиден лимит'
    },
    search: {
      'Search term too long': 'Термина за търсене е прекалено дълъг',
      'Search term is required': 'Термина за търсене е задължителен'
    },
    sortBy: {
      'Invalid sort field': 'Невалидно поле за сортиране'
    },
    sortOrder: {
      'Sort order must be asc or desc': 'Редът на сортиране трябва да е asc или desc'
    },
    
    // Bio field
    bio: {
      'Bio is too long': 'Биографията е прекалено дълга',
      'String must contain at most 500 character(s)': 'Биографията не може да бъде по-дълга от 500 символа'
    },
    
    // Preferences
    emailNotifications: {
      'Invalid notification setting': 'Невалидна настройка за известия'
    },
    pushNotifications: {
      'Invalid notification setting': 'Невалидна настройка за известия'
    },
    marketingEmails: {
      'Invalid marketing setting': 'Невалидна настройка за маркетинг'
    },
    
    // User management fields  
    isActive: {
      'Active status must be true or false': 'Статусът активен трябва да е true или false'
    },
    emailVerified: {
      'Email verification status must be true or false': 'Статусът за верификация на имейл трябва да е true или false'
    },
    userId: {
      'Invalid user ID format': 'Невалиден формат на потребителско ID',
      'User not found': 'Потребителят не беше намерен'
    },
    
    // File upload validation
    fileSize: {
      'File size exceeds limit': 'Размерът на файла надвишава лимита',
      'File is too large': 'Файлът е прекалено голям'
    },
    fileType: {
      'File type not allowed': 'Типът файл не е разрешен',
      'Invalid file format': 'Невалиден формат на файл'
    },
    
    // General system messages
    general: {
      'Network Error': 'Проблем с мрежата. Моля, проверете интернет връзката.',
      'Server Error': 'Сървърна грешка. Моля, опитайте отново по-късно.',
      'Unauthorized': 'Нямате права за това действие.',
      'Forbidden': 'Достъпът е забранен.',
      'Not Found': 'Търсеният ресурс не беше намерен.',
      'Validation Error': 'Грешка при валидация на данните.',
      'Database Error': 'Грешка в базата данни.',
      'Unknown Error': 'Възникна неочаквана грешка.',
      'Required': 'Това поле е задължително',
      'Invalid': 'Невалидна стойност',
      'Too short': 'Стойността е прекалено кратка',
      'Too long': 'Стойността е прекалено дълга'
    }
  };

  // Check for contextual overrides
  const contextualOverrides: Record<string, Record<string, string>> = {
    article: {
      'Required field': 'Това поле е задължително за статията',
      'Invalid format': 'Невалиден формат за това поле'
    },
    registration: {
      'Required field': 'Това поле е задължително за регистрация',
      'Invalid format': 'Моля, въведете валидна информация'
    },
    media: {
      'Upload failed': 'Качването неуспешно. Моля, опитайте отново.',
      'Invalid format': 'Този формат файл не се поддържа'
    }
  };

  // Try contextual override first
  if (context?.form && contextualOverrides[context.form]?.[originalMessage]) {
    return contextualOverrides[context.form][originalMessage];
  }

  // Try field-specific message
  if (friendlyMessages[field]?.[originalMessage]) {
    return friendlyMessages[field][originalMessage];
  }

  // Try general message
  if (friendlyMessages.general?.[originalMessage]) {
    return friendlyMessages.general[originalMessage];
  }

  // Fallback to original message or generic message
  // Security: Sanitize message before fallback
  const sanitizedMessage = sanitizeErrorMessage(originalMessage);
  return sanitizedMessage || 'Възникна грешка при обработка на данните.';
}

/**
 * Security: Sanitize error messages to prevent information disclosure
 */
function sanitizeErrorMessage(message: string): string {
  if (!message) return '';

  // Security: Remove sensitive patterns that could expose system info
  const sensitivePatterns = [
    /\/[a-zA-Z]:[\\\/].+/g,         // Windows file paths
    /\/[a-zA-Z\/].+\.js:\d+/g,      // JavaScript file paths with line numbers
    /at\s+.+\s+\(.+:\d+:\d+\)/g,   // Stack trace patterns
    /Error:\s*ENOENT.*$/g,          // File system errors
    /Error:\s*ECONNREFUSED.*$/g,    // Connection errors
    /localhost:\d+/g,               // Local server references
    /127\.0\.0\.1:\d+/g,           // Local IP references
    /\b\w+@\w+\.\w+\b/g,           // Email addresses in errors
    /password[s]?\s*[:=]\s*\S+/gi, // Password values
    /token[s]?\s*[:=]\s*\S+/gi,    // Token values
    /api[_-]?key[s]?\s*[:=]\s*\S+/gi, // API keys
    /secret[s]?\s*[:=]\s*\S+/gi,   // Secrets
    /SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN/gi, // SQL patterns
    /prisma\./gi,                   // ORM references
    /\$\d+/g,                      // SQL parameter placeholders
  ];

  let sanitized = message;
  
  // Remove sensitive patterns
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  // Remove any remaining bracketed technical info
  sanitized = sanitized.replace(/\[.*?\]/g, '');
  
  // Clean up extra spaces
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // If message became empty or too short after sanitization, return generic message
  if (!sanitized || sanitized.length < 3 || sanitized === '[REDACTED]') {
    return 'Възникна техническа грешка.';
  }
  
  return sanitized;
}

export function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    // Authentication fields
    password: 'Парола',
    confirmPassword: 'Потвърждение на парола',
    email: 'Имейл',
    name: 'Име',
    firstName: 'Име', 
    lastName: 'Фамилия',
    role: 'Роля',
    
    // Article fields
    title: 'Заглавие',
    excerpt: 'Кратко описание',
    content: 'Съдържание',
    slug: 'URL адрес',
    category: 'Категория',
    subcategory: 'Подкатегория',
    featuredImage: 'Основна снимка',
    tags: 'Тагове',
    authorName: 'Автор',
    zones: 'Зони',
    
    // Media fields
    file: 'Файл',
    filename: 'Име на файл',
    fileType: 'Тип файл',
    fileSize: 'Размер на файл',
    
    // General fields
    description: 'Описание',
    url: 'URL адрес',
    phone: 'Телефон',
    address: 'Адрес',
    date: 'Дата',
    time: 'Час'
  };

  return fieldNames[field] || field;
}

// Helper function to create structured error for API calls
export function createStructuredError(
  message: string, 
  validationErrors: ParsedValidationError[], 
  originalError?: any
) {
  return {
    message,
    validationErrors,
    originalError,
    hasValidationErrors: validationErrors.length > 0
  };
}

// Helper function to extract errors from API response (security-safe)
export function extractErrorsFromResponse(error: any, context?: ErrorContext): ParsedValidationError[] {
  if (!error) return [];
  
  // Security: Don't trust client-side error objects completely
  try {
    // Check if it's already a structured error
    if (error.validationErrors && Array.isArray(error.validationErrors)) {
      // Security: Validate each error object
      const safeErrors = error.validationErrors
        .filter((err: any) => err && typeof err === 'object')
        .map((err: any) => ({
          field: typeof err.field === 'string' ? err.field : 'general',
          message: sanitizeErrorMessage(err.message || ''),
          type: (['validation', 'required', 'format', 'duplicate', 'length', 'permission', 'server'].includes(err.type)) 
            ? err.type : 'validation',
          severity: (['error', 'warning', 'info'].includes(err.severity)) ? err.severity : 'error'
        }))
        .filter((err: ParsedValidationError) => err.message.length > 0);
        
      return safeErrors.length > 0 ? safeErrors : getDefaultSecurityError(context);
    }
    
    // Parse from message with security sanitization
    const message = sanitizeErrorMessage(error.message || error.toString() || '');
    return parseValidationErrors(message, context);
  } catch (parseError) {
    // Security: If parsing fails, return safe generic error
    console.warn('Error parsing failed:', parseError);
    return getDefaultSecurityError(context);
  }
}

/**
 * Security: Get default safe error when parsing fails
 */
function getDefaultSecurityError(context?: ErrorContext): ParsedValidationError[] {
  const contextMessages = {
    registration: 'Грешка при създаване на акаунта. Моля, проверете данните и опитайте отново.',
    login: 'Грешка при влизане. Моля, проверете данните и опитайте отново.',
    article: 'Грешка при обработка на статията. Моля, опитайте отново.',
    media: 'Грешка при обработка на файла. Моля, опитайте отново.'
  };

  return [{
    field: 'general',
    message: contextMessages[context?.form || 'general'] || 'Възникна техническа грешка. Моля, опитайте отново.',
    type: 'server',
    severity: 'error'
  }];
}

// Validation helpers for common fields (matching backend validation)
export const ValidationHelpers = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  },
  
  isStrongPassword(password: string): boolean {
    return password.length >= 8 &&
           password.length <= 128 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  },
  
  isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-ZàáâäčđèéêëìíîïñòóôöšüùúûýžА-Яа-я\s'-]+$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
  },
  
  isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 255;
  },
  
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB (matching backend)
    return validTypes.includes(file.type) && file.size <= maxSize;
  },
  
  isValidArticleTitle(title: string): boolean {
    return title.length >= 3 && title.length <= 255;
  },
  
  isValidArticleContent(content: string): boolean {
    return content.length >= 10;
  },
  
  isValidExcerpt(excerpt: string): boolean {
    return excerpt.length <= 500;
  },
  
  // User role validation
  isValidUserRole(role: string): boolean {
    const validRoles = ['FREE', 'PLAYER', 'COACH', 'PARENT', 'ADMIN'];
    return validRoles.includes(role);
  },
  
  // Article category validation  
  isValidArticleCategory(category: string): boolean {
    const validCategories = [
      'TACTICS', 'TRAINING', 'PSYCHOLOGY', 'NUTRITION', 'TECHNIQUE', 
      'FITNESS', 'NEWS', 'INTERVIEWS', 'ANALYSIS', 'YOUTH', 
      'CONDITIONING', 'PERIODIZATION', 'MANAGEMENT'
    ];
    return validCategories.includes(category);
  },
  
  // Zone validation
  isValidZone(zone: string): boolean {
    const validZones = ['read', 'coach', 'player', 'parent', 'series'];
    return validZones.includes(zone);
  },
  
  // Bio validation
  isValidBio(bio: string): boolean {
    return bio.length <= 500;
  },
  
  // SEO validation
  isValidSeoTitle(seoTitle: string): boolean {
    return seoTitle.length <= 255;
  },
  
  isValidSeoDescription(seoDescription: string): boolean {
    return seoDescription.length <= 320;
  },
  
  // Media file validation
  isValidMediaFile(file: File): boolean {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    
    const allValidTypes = [...validImageTypes, ...validVideoTypes, ...validDocTypes, ...validAudioTypes];
    const maxSize = 50 * 1024 * 1024; // 50MB for all media
    
    return allValidTypes.includes(file.type) && file.size <= maxSize;
  },
  
  // 2FA token validation
  isValidTwoFactorToken(token: string): boolean {
    return /^\d{6}$/.test(token);
  },
  
  // UUID validation
  isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },
  
  // Security: Input sanitization to prevent XSS and injection
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '')                                              // Remove HTML tags
      .replace(/javascript:/gi, '')                                         // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '')                                          // Remove event handlers
      .replace(/expression\s*\(/gi, '')                                    // Remove CSS expressions
      .trim()
      .slice(0, 1000); // Limit length
  },
  
  // Security: Check for suspicious patterns in user input
  isSuspiciousInput(input: string): boolean {
    if (typeof input !== 'string') return false;
    
    const suspiciousPatterns = [
      /<script/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /expression\s*\(/gi,
      /\bexec\(/gi,
      /\beval\(/gi,
      /\bfunction\(/gi,
      /\/\*.*\*\//gi,
      /--/g,
      /\/\*/g,
      /\*\//g,
      /'.*or.*'/gi,
      /".*or.*"/gi,
      /union.*select/gi,
      /insert.*into/gi,
      /update.*set/gi,
      /delete.*from/gi,
      /drop.*table/gi,
      /create.*table/gi,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  },
  
  // Security: Rate limiting check (client-side helper)
  checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    if (typeof window === 'undefined') return true; // Server-side always allows
    
    try {
      const storageKey = `rate_limit_${key}`;
      const stored = localStorage.getItem(storageKey);
      const now = Date.now();
      
      if (!stored) {
        localStorage.setItem(storageKey, JSON.stringify({ count: 1, resetTime: now + windowMs }));
        return true;
      }
      
      const data = JSON.parse(stored);
      
      if (now > data.resetTime) {
        localStorage.setItem(storageKey, JSON.stringify({ count: 1, resetTime: now + windowMs }));
        return true;
      }
      
      if (data.count >= maxAttempts) {
        return false; // Rate limit exceeded
      }
      
      data.count += 1;
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      // If localStorage fails, be permissive
      console.warn('Rate limit check failed:', error);
      return true;
    }
  },
  
  // Security: Clear rate limit data
  clearRateLimit(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(`rate_limit_${key}`);
    } catch (error) {
      console.warn('Failed to clear rate limit:', error);
    }
  }
};

/**
 * Security: Log suspicious activities (client-side helper)
 */
export function logSecurityEvent(eventType: string, details: any = {}, context?: ErrorContext): void {
  // Only log in development or with explicit consent
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  try {
    const event = {
      timestamp: new Date().toISOString(),
      type: eventType,
      context: context?.form || 'unknown',
      details: sanitizeLogDetails(details),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };
    
    console.warn('Security Event:', event);
    
    // In production, this would send to security monitoring service
    // sendToSecurityService(event);
  } catch (error) {
    // Don't let logging errors affect application
    console.warn('Security logging failed:', error);
  }
}

/**
 * Security: Sanitize log details to prevent log injection
 */
function sanitizeLogDetails(details: any): any {
  if (typeof details !== 'object' || details === null) {
    return typeof details === 'string' ? details.slice(0, 200) : details;
  }
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(details)) {
    if (typeof value === 'string') {
      sanitized[key] = value.replace(/[\r\n\t]/g, ' ').slice(0, 200);
    } else if (typeof value === 'object') {
      sanitized[key] = '[OBJECT]';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}