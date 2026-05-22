# Quick Start Guide - AI Legal Team Agent

> **Status:** the Streamlit walk-through below is the **planned** UI flow. `app.py` and `sample_contract.txt` are not yet shipped in this repo. For the workflow that runs today, use the CLI orchestrator described in the root [README](../README.md#-python-quickstart) (`python main.py path/to/document.txt`).

## Get Started in 3 Minutes! 🚀

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Run the Application

```bash
streamlit run app.py
```

The app will automatically open in your browser at `http://localhost:8501`

### Step 3: Try It Out!

1. **Upload the Sample Document** - select `sample_contract.txt` from the project folder
2. **Select an Analysis Type** - e.g., "Compliance Check"
3. **Click Analyze** - watch the agents work!

### Explore the Results

- **Analysis Tab**: Detailed compliance findings
- **Key Points Tab**: 10 most important contract terms
- **Recommendations Tab**: 7 actionable improvements
- **Redline Tab**: Specific proposed changes with before/after text

### Analysis Types

| Type | What It Does |
|------|-------------|
| **Compliance Check** | Regulatory compliance analysis (GDPR, CCPA, employment law) |
| **Contract Review** | Detailed term-by-term analysis |
| **Legal Research** | Case law and precedents |
| **Risk Assessment** | Strategic risk evaluation |
| **Custom Query** | Ask: "What should I double check?" |

### Tips for Best Results

- Upload PDF, TXT, or DOCX files (up to 200MB)
- Use the filters in Key Points and Recommendations tabs
- Try different analysis types on the same document
- Export redlines as TXT or CSV

### Common Issues

**"Command not found: streamlit"**
```bash
python -m pip install streamlit
```

**Port already in use**
```bash
streamlit run app.py --server.port 8502
```

---

**Enjoy analyzing legal documents with AI!** ⚖️✨
