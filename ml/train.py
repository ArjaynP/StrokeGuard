# Import necessary libraries
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
import joblib
import matplotlib.pyplot as plt
import os

# ── Load preprocessed data ──────────────────────────────────────────
X_train = np.load('model/X_train.npy')
X_test  = np.load('model/X_test.npy')
y_train = np.load('model/y_train.npy')
y_test  = np.load('model/y_test.npy')

print(f"X_train: {X_train.shape}, y_train: {y_train.shape}")
print(f"X_test:  {X_test.shape},  y_test:  {y_test.shape}")

# ── Convert to PyTorch tensors ───────────────────────────────────────
X_train_t = torch.FloatTensor(X_train)
y_train_t = torch.FloatTensor(y_train).unsqueeze(1)
X_test_t  = torch.FloatTensor(X_test)
y_test_t  = torch.FloatTensor(y_test).unsqueeze(1)

train_dataset = TensorDataset(X_train_t, y_train_t)
train_loader  = DataLoader(train_dataset, batch_size=32, shuffle=True)

# ── Model Architecture ───────────────────────────────────────────────
class StrokeNet(nn.Module):
    def __init__(self, input_dim):
        super(StrokeNet, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.4),

            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.4),

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

input_dim = X_train.shape[1]
model     = StrokeNet(input_dim)
print(f"\nModel Architecture:\n{model}")
print(f"Input features: {input_dim}")

# ── Loss & Optimizer ─────────────────────────────────────────────────
# Class weights to further handle imbalance
# pos_weight = torch.tensor([y_train.tolist().count(0) / y_train.tolist().count(1)]) --- removing pos_weight as SMOTE already handles balance.
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=3e-4, weight_decay=1e-3)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5, factor=0.5)

# ── Training Loop ────────────────────────────────────────────────────
EPOCHS        = 150
PATIENCE      = 10
best_val_loss = float('inf')
patience_ctr  = 0
train_losses  = []
val_losses    = []

for epoch in range(EPOCHS):
    # Training
    model.train()
    epoch_loss = 0
    for X_batch, y_batch in train_loader:
        optimizer.zero_grad()
        preds = model(X_batch)
        loss  = criterion(preds, y_batch)
        loss.backward()
        optimizer.step()
        epoch_loss += loss.item()

    avg_train_loss = epoch_loss / len(train_loader)

    # Validation
    model.eval()
    with torch.no_grad():
        val_preds = model(X_test_t)
        val_loss  = criterion(val_preds, y_test_t).item()

    train_losses.append(avg_train_loss)
    val_losses.append(val_loss)
    scheduler.step(val_loss)

    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1:3d}/{EPOCHS} | Train Loss: {avg_train_loss:.4f} | Val Loss: {val_loss:.4f}")

    # Early stopping
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        patience_ctr  = 0
        torch.save(model.state_dict(), 'model/stroke_model.pt')
        print(f"  ✅ Best model saved at epoch {epoch+1}")
    else:
        patience_ctr += 1
        if patience_ctr >= PATIENCE:
            print(f"\n⏹ Early stopping at epoch {epoch+1}")
            break

# ── Plot Loss Curves ─────────────────────────────────────────────────
plt.figure(figsize=(10, 5))
plt.plot(train_losses, label='Train Loss', color='steelblue')
plt.plot(val_losses,   label='Val Loss',   color='tomato')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('Training vs Validation Loss — StrokeGuard')
plt.legend()
plt.tight_layout()
plt.savefig('model/loss_curve.png')
plt.show()
print("Loss curve saved!")

# ── Save model metadata ──────────────────────────────────────────────
joblib.dump({'input_dim': input_dim}, 'model/model_metadata.pkl')
print(f"\nTraining complete! Best val loss: {best_val_loss:.4f}")