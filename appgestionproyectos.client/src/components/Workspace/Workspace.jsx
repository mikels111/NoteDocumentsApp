import React, { useEffect, useState, useContext } from 'react';
import { AuthRequest } from '../../Utils/Authorization';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../SideBar/SideBar'
import { Notify } from '../../Utils/Notifications';
import { ToastContainer } from 'react-toastify';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';
import { Context } from '../Router/Router';
import ProjectCard from '../Projects/ProjectCard';
import styles from './Workspace.module.css';
function Workspace() {
    const { globalWorkspace, setGlobalWorkspace, globalUserProjects } = useContext(Context);
    const navigate = useNavigate();
    const [wEnvironments, setWEnvironments] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [query, setQuery] = useState("");
    
    const styles1 = {
        "display": "flex",
        "alignItems": "flex-start",
        "alignContent": "flex-start",
        "gap": "33px 35px",
        "flexWrap": "wrap"
    }

    let filtered = [];
    filtered = globalUserProjects.filter(
        (p) => p.name.toLowerCase().includes(query.toLowerCase())
    )

    const styles2 = {
        "borderRadius": "5px",
        "border": "0.5px solid #000",
        "width": "180px",
        "height": "50px"
    }
    const selected = (e) => {
        console.log(e.target, "target")
        try {
            if (e.target != undefined) {
                const selectedId = parseInt(e.target.value, 10);
                const workspace = wEnvironments.find(w => w.id === selectedId);
                console.log(workspace.id, "workspace");
                setGlobalWorkspace(workspace.id)
                
            }
        } catch (exception) {
            console.error(exception)
        }
    }

    useEffect(() => {
        const publicBase = import.meta.env.BASE_URL ?? '/'
        AuthRequest(`/api/WEnvironment/getWEnvironments`, 'get').
            then((res) => {
                setWEnvironments(res.data.data);
            }).
            catch((err) => {
                console.error(err.status);
                if (err.status == 401) {
                    navigate("/login");

                }
            });
    }, []);

    return (
        <div className={styles["content-wrapper"]}>
            
            <Form.Select onChange={selected} value={globalWorkspace} style={{ width: "auto" }}>
                <Placeholder xs={12} bg="success" />
                {
                    wEnvironments.length > 0 &&
                    wEnvironments.map((wEnv, i) => {
                        wEnv.reference = i;
                        return (<option key={i} value={wEnv.id}>{wEnv.name}</option>)
                    })
                }
            </Form.Select>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar proyectos..."
                style={{
                    marginTop: "15px",
                    marginBottom: "15px",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "300px",
                    fontSize: "14px"
                }}
            />
            <h2 style={{ marginTop: "20px", marginBottom: "15px", fontSize: "1.5rem", fontWeight: "600" }}>
                Mis Proyectos
            </h2>
            <div style={styles1}>
                {filtered.length > 0 ? (
                    filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <p style={{ color: "#999", fontSize: "14px" }}>
                        No hay proyectos disponibles
                    </p>
                )}
            </div>
        </div>
    );


}
function WorkspaceSelection({ workEnv, selected }) {
    const [selectedValue, setSelectedValue] = useState();
    useEffect(() => {
        if (workEnv.length > 0) {
            selected(JSON.stringify(workEnv[0]));
            setSelectedValue(JSON.stringify(workEnv[0]));
        }
    }, [workEnv]);
    return (
        <>
            {
                localStorage.getItem("worksp") != null && localStorage.getItem("worksp") != undefined &&
                <select onChange={selected} value={JSON.parse(localStorage.getItem("worksp")).id}>
                    {
                        workEnv.length > 0 &&
                        workEnv.map((wEnv, i) => {
                            wEnv.reference = i;
                            return <option key={i} value={wEnv.id}>{wEnv.name}</option>
                        })
                    }
                </select >
            }

        </>
    );
}
export default Workspace;