SHOW DATABASES;
USE db17468;
-- SHOW TABLES;
INSERT INTO users (
    username,
    email,
    passwordHash,
    passwordSalt,
    fullName,
    phoneNumber,
    roles,
    status,
    isEmailVerified,
    isPhoneVerified,
    twoFactorEnabled,
    birthday,
    profileImageUrl,
    bio,
    createdDate,
    updatedDate
)
VALUES
(
    'john_doe',
    'john.doe@example.com',
    'hashedPassword1',
    'salt1',
    'John Doe',
    '123-456-7890',
    '["USER"]',  -- Assuming roles are stored as JSON array
    'ACTIVE',
    true,
    true,
    false,
    '1990-01-01',
    'http://example.com/image.jpg',
    'Lorem ipsum',
    NOW(),  -- createdDate
    NOW()   -- updatedDate
),
(
    'jane_smith',
    'jane.smith@example.com',
    'hashedPassword2',
    'salt2',
    'Jane Smith',
    '098-765-4321',
    '["USER"]',  -- Assuming roles are stored as JSON array
    'ACTIVE',
    true,
    false,
    true,
    '1985-05-15',
    'http://example.com/image2.jpg',
    'Dolor sit amet',
    NOW(),  -- createdDate
    NOW()   -- updatedDate
);
