import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "./style.css"
import { useSelector, useDispatch } from 'react-redux'
import { setOpticAsync } from '../../redux/optic/opticSlice'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { addTemplate, updateTemplate } from '../../redux/templates/templateSlicer'


const OpticEditPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const optic = useSelector((state) => state.optic);
    const [myOptic, setMyOptic] = useState(optic)
    const templates = useSelector((state) => state.templates);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await dispatch(setOpticAsync(myOptic)).unwrap();
            navigate("/");
        } catch (error) {
            toast.error(error);
            return;
        }
    
        const changingTemplate = templates.find(template => template.id === myOptic.id);
        const isChanged = changingTemplate && JSON.stringify(changingTemplate) !== JSON.stringify(myOptic);
    
        if (isChanged) {
            const confirm = window.confirm("Bu ayarlar mevcut bir şablonun üzerine yazılsın mı?");
            if (confirm) {
                dispatch(updateTemplate(myOptic));
            }
        } else if (!changingTemplate) {
            const confirm = window.confirm("Bu ayarlar yeni bir şablon olarak kaydedilsin mi?");
            if (confirm) {
                dispatch(addTemplate(myOptic));
            }
        }
    };

    const handleChange = (e) => {
      const { name, type, value, valueAsNumber } = e.target;

      let newValue;
      if (name === "examTime") {
        // examTime (minutes to ms)
        newValue = valueAsNumber * 60 * 1000;
      } else if (type === "number") {
        newValue = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
      } else {
        newValue = value;
      }

      setMyOptic((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    };

    const addSubject = () => {
        setMyOptic({ 
            ...myOptic, 
            subjects: [...(myOptic.subjects || []), { name: "Ders - " + ((myOptic.subjects?.length || 0) + 1), questionCount: 30 }] 
        })
    }

    useEffect(() => {
        document.title = "Sanal Optik - Düzenle";
    }, []);

    return (
        <div className="optic-edit">
            <div className="container optic-edit-container">
                <h1 className="title">Optik Düzenle</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="template">Hazır şablonlar</label>
                        <select id="template" name="template" defaultValue={myOptic.name} onChange={(e) => {
                            const selectedTemplate = templates.find((template) => template.id === parseInt(e.target.value));
                            if (selectedTemplate) {
                                setMyOptic(selectedTemplate);
                            }
                        }}>
                            {templates.map((template, index) => (
                                <option key={index} value={template.id}>{template.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exam-type">Sınav türü</label>
                        <select id="exam-type" name="examType" value={myOptic.examType} onChange={handleChange}>
                            <option value="singleSubject">Tek Dersli</option>
                            <option value="multiSubject">Çok Dersli</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exam-name">Sınav adı</label>
                        <input type="text" id="exam-name" name="name" value={myOptic.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exam-time">Sınav süresi (dakika)</label>
                        <input type="number" id="exam-time" name="examTime" value={(myOptic.examTime / 60 / 1000) || 0} onChange={handleChange} />
                    </div>
                    <div className="form-group" data-visible={myOptic.examType == "singleSubject"}>
                        <label htmlFor="question-count">Soru sayısı</label>
                        <input type="number" id="question-count" name="questionCount" value={myOptic.questionCount || 0} onChange={handleChange} />
                    </div>
                    <div className="form-group" data-visible={myOptic.examType === "multiSubject"}>
                        <div className="subjects-header">
                            <h3 className="subject-title">Dersler</h3>
                            <div className="new-subject">
                                <button className="action-button" type="button" title="Ders Ekle" onClick={addSubject}><FontAwesomeIcon icon={faPlus} /></button>
                            </div>
                        </div>
                        {myOptic.subjects?.map((subject, index) => (
                            <div key={index} className="subject">
                                <input type="text" name={`subject-name-${index}`} value={subject.name} onChange={(e) => {
                                    const newSubject = {
                                        name: e.target.value,
                                        questionCount: subject.questionCount
                                    }
                                    setMyOptic({ ...myOptic, subjects: myOptic.subjects.map((s, i) => i === index ? newSubject : s) })
                                }} />
                                <input type="number" name={`subject-question-count-${index}`} value={subject.questionCount} onChange={(e) => {
                                    const newSubject = {
                                        name: subject.name,
                                        questionCount: parseInt(e.target.value)
                                    }
                                    setMyOptic({ ...myOptic, subjects: myOptic.subjects.map((s, i) => i === index ? newSubject : s) })
                                }} />
                                <div className="action-buttons">
                                    {/* <button className="action-button" type="button" onClick={() => {
                                        const newSubject = {
                                            name: document.getElementsByName(`subject-name-${index}`)[0].value,
                                            questionCount: document.getElementsByName(`subject-question-count-${index}`)[0].value
                                        }
                                        dispatch(setSubject({ id: subject.id, subject: newSubject }));
                                        toast.success("Ders başarıyla güncellendi.");
                                    }}><FontAwesomeIcon icon={faCheck} /></button> */}

                                    {/* <button className="action-button" type="button" onClick={() => {
                                        setMyOptic({ ...myOptic, subjects: myOptic.subjects.filter((s) => s !== subject) })
                                    }}><FontAwesomeIcon icon={faArrowUp} /></button> */}


                                    <button className="action-button" type="button" title="Sil"
                                        onClick={() => {
                                            setMyOptic({ ...myOptic, subjects: myOptic.subjects.filter((s) => s !== subject) })
                                        }}><FontAwesomeIcon icon={faTrash} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="form-btn">Kaydet</button>
                </form>

            </div>
        </div>
    )
}

export default OpticEditPage