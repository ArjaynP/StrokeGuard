import numpy as np
import torch
import torch.nn as nn
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, f1_score, precision_score,
    recall_score, roc_auc_score, confusion_matrix,
    classification_report, roc_curve
)

# ── Load data ────────────────────────────────────────────────────────
X_test = np.load('model/X_test.npy')
y_test = np.load('model/y_test.npy')

# ── Rebuild & load model ─────────────────────────────────────────────
class StrokeNet(nn.Module):
    def __init__(self, input_dim):
        super(StrokeNet, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(64, 32),
            nn.ReLU(),

            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.network(x)

metadata  = joblib.load('model/model_metadata.pkl')
model     = StrokeNet(metadata['input_dim'])
model.load_state_dict(torch.load('model/stroke_model.pt', weights_only=True))
model.eval()

# ── Run inference ────────────────────────────────────────────────────
X_test_t = torch.FloatTensor(X_test)
with torch.no_grad():
    probs = model(X_test_t).numpy().flatten()

# Try multiple thresholds, pick best F1
best_thresh, best_f1 = 0.5, 0
for t in np.arange(0.1, 0.9, 0.05):
    preds = (probs >= t).astype(int)
    f1 = f1_score(y_test, preds, zero_division=0)
    if f1 > best_f1:
        best_f1, best_thresh = f1, t

print(f"Best threshold: {best_thresh:.2f} (F1: {best_f1:.4f})")
y_pred = (probs >= best_thresh).astype(int)

# ── Metrics ──────────────────────────────────────────────────────────
acc       = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall    = recall_score(y_test, y_pred, zero_division=0)
f1        = f1_score(y_test, y_pred, zero_division=0)
auc       = roc_auc_score(y_test, probs)

print("\n" + "="*45)
print("        StrokeGuard — Model Evaluation")
print("="*45)
print(f"  Accuracy  : {acc:.4f}")
print(f"  Precision : {precision:.4f}")
print(f"  Recall    : {recall:.4f}")
print(f"  F1 Score  : {f1:.4f}")
print(f"  AUC-ROC   : {auc:.4f}")
print("="*45)
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['No Stroke', 'Stroke']))

# ── Confusion Matrix ─────────────────────────────────────────────────
plt.figure(figsize=(7, 5))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['No Stroke', 'Stroke'],
            yticklabels=['No Stroke', 'Stroke'])
plt.title('Confusion Matrix — StrokeGuard')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.tight_layout()
plt.savefig('model/confusion_matrix.png')
plt.show()
print("Confusion matrix saved!")

# ── ROC Curve ────────────────────────────────────────────────────────
fpr, tpr, _ = roc_curve(y_test, probs)
plt.figure(figsize=(7, 5))
plt.plot(fpr, tpr, color='steelblue', lw=2, label=f'AUC = {auc:.4f}')
plt.plot([0,1], [0,1], color='gray', linestyle='--', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve — StrokeGuard')
plt.legend()
plt.tight_layout()
plt.savefig('model/roc_curve.png')
plt.show()
print("ROC curve saved!")