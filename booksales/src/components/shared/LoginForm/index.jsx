import './Styles/loginform.css';
function LoginForm() {
    return (
        <form className="form">
            <input
                type="text"
                placeholder="Username"
                className="input"
            />

            <input
                type="email"
                placeholder="Email"
                className="input"
            />

            <input
                type="password"
                placeholder="Password"
                className="input"
            />

            <button
                type="button"
                className="button"
            >
                Login
            </button>
        </form>
    );
}

export default LoginForm;