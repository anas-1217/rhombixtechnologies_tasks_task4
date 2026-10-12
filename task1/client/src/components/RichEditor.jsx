import { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api, { API_URL } from '../services/api';

export default function RichEditor({ value, onChange }) {
  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block', 'link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: async () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.click();
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              const form = new FormData();
              form.append('image', file);
              const { data } = await api.post('/api/admin/upload', form);
              const editor = quillRef.current?.getEditor();
              const range = editor?.getSelection(true);
              const url = data.url.startsWith('http') ? data.url : `${API_URL}${data.url}`;
              editor?.insertEmbed(range?.index || 0, 'image', url, 'user');
            };
          },
        },
      },
    }),
    []
  );

  return (
    <div className="editor-wrap">
      <ReactQuill ref={quillRef} theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  );
}
