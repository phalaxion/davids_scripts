import sys, string, random
from PySide6.QtWidgets import QApplication, QCheckBox, QFrame, QHBoxLayout, QLabel, QPushButton, QSpinBox, QTextEdit, QWidget, QVBoxLayout
from PySide6.QtGui import QFont
from PySide6.QtCore import Qt 

class PasswordGenerator(QWidget):
    supported_symbols = "!@#$%^&*_+"

    def __init__(self):
        super().__init__()

        self.setWindowTitle("Password Generator")
        self.setMinimumWidth(300)
        self.setMinimumHeight(240)

        self._build_ui()

        self.generate()
    
    def _build_ui(self):
        layout = QVBoxLayout()
        
        self.length = QSpinBox(value=16, maximum=9999)

        self.lowercase = QCheckBox("a-z")
        self.lowercase.setChecked(True)

        self.uppercase = QCheckBox("A-Z")
        self.uppercase.setChecked(True)

        self.numbers = QCheckBox("0-9")

        self.symbols = QCheckBox(self.supported_symbols)

        header_row = QHBoxLayout();
        header_row.addWidget(QLabel("Length:"))
        header_row.addWidget(self.length)

        generate_button = QPushButton("Generate")
        generate_button.clicked.connect(self.generate)

        header_row.addWidget(generate_button, stretch=1)

        layout.addLayout(header_row)

        checkboxes = QHBoxLayout();
        checkboxes.addWidget(self.lowercase)
        checkboxes.addWidget(self.uppercase)
        checkboxes.addWidget(self.numbers)
        checkboxes.addWidget(self.symbols)

        layout.addLayout(checkboxes)

        self.generated_password = QTextEdit("")
        self.generated_password.setReadOnly(True)
        self.generated_password.setAlignment(Qt.AlignmentFlag.AlignHCenter)
        self.generated_password.setFont(QFont("Helvetica", 18))
        self.generated_password.mousePressEvent = lambda _: self.copy_to_clipboard()
        self.generated_password.setFrameShape(QFrame.NoFrame)
        self.generated_password.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.generated_password.setMinimumHeight(18)
        self.generated_password.viewport().setCursor(Qt.PointingHandCursor)

        layout.addWidget(self.generated_password, stretch=1)

        self.setLayout(layout)
    
    def generate(self):
        characters = [];

        if self.lowercase.isChecked():
            characters += list(string.ascii_lowercase)

        if self.uppercase.isChecked():
            characters += list(string.ascii_uppercase)
        
        if self.numbers.isChecked():
            characters += list(string.digits)
        
        if self.symbols.isChecked():
            characters += list(self.supported_symbols)

        password = ''.join(random.choices(characters, k=self.length.value()))

        self.generated_password.setText(password)

    def copy_to_clipboard(self):
        text_to_copy = self.generated_password.toPlainText()
        QApplication.clipboard().setText(text_to_copy)

if __name__ == "__main__":
    app = QApplication([])

    window = PasswordGenerator()
    window.show()

    sys.exit(app.exec())