<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with('user')->latest()->get();
        $users = User::all();

        return Inertia::render('admin/documents/index', [
            'documents' => $documents,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100', // e.g., Contract, ID, Cert
            'file' => 'required|file|mimes:pdf,jpg,png,doc,docx|max:2048',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $path = $request->file('file')->store('documents', 'public');

        Document::create([
            'user_id' => $request->user_id,
            'title' => $request->title,
            'type' => $request->type,
            'file_path' => $path,
            'expiry_date' => $request->expiry_date,
            'notes' => $request->notes,
        ]);

        return redirect()->route('admin.documents.index')->with('success', 'Document uploaded successfully.');
    }

    public function destroy(Document $document)
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->route('admin.documents.index')->with('success', 'Document deleted.');
    }

    public function update(Request $request, Document $document)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $document->update($request->only(['title', 'type', 'expiry_date', 'notes']));

        return redirect()->route('admin.documents.index')->with('success', 'Document updated successfully.');
    }

    public function download(Document $document)
    {
        $extension = pathinfo($document->file_path, PATHINFO_EXTENSION);

        return Storage::disk('public')->download($document->file_path, $document->title.'.'.$extension);
    }

    public function downloadAll($userId)
    {
        $user = User::findOrFail($userId);
        $documents = Document::where('user_id', $userId)->get();

        if ($documents->isEmpty()) {
            return redirect()->back()->with('error', 'No documents found for this employee.');
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.document_inventory', [
            'user' => $user,
            'documents' => $documents,
            'date' => now()->format('F d, Y'),
        ]);

        $zip = new \ZipArchive;
        $zipFileName = 'Employee_Documents_'.str_replace(' ', '_', $user->name).'_'.now()->format('Ymd').'.zip';
        $zipPath = storage_path('app/public/'.$zipFileName);

        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            // Add Inventory PDF
            $zip->addFromString('Document_Inventory.pdf', $pdf->output());

            // Add all files
            foreach ($documents as $doc) {
                $filePath = Storage::disk('public')->path($doc->file_path);
                if (file_exists($filePath)) {
                    $extension = pathinfo($filePath, PATHINFO_EXTENSION);
                    $zip->addFile($filePath, $doc->type.'/'.$doc->title.'.'.$extension);
                }
            }
            $zip->close();
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }
}
