import Navbar from '../Navbar/Navbar';
import './Layout.scss';

export default function Layout({ children }) {
    return (
        <div className="layout">
            <Navbar />
            <main className="layout__main">
                {children}
            </main>
            <footer className="layout__footer">
                <div className="container">
                    <p className="layout__footer-text">
                        © 2024 SKYSQLStudio — Built for learning SQL interactively.
                    </p>
                </div>
            </footer>
        </div>
    );
}
