-- V3: Remove the original 6 ML seed questions so DataLoader can replace them
-- with the expanded 32-question ML set. Cascades via ON DELETE CASCADE to
-- question_keywords and question_ideal_answers.

DELETE FROM questions
WHERE text IN (
    'What is overfitting and how do you prevent it?',
    'What is the difference between supervised and unsupervised learning?',
    'Explain the bias-variance tradeoff.',
    'What is gradient descent and how does it work?',
    'Explain how a transformer model works.',
    'What is the difference between bagging and boosting?'
);
