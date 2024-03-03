const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.replace('/login');
};
const Header = () => {
  const data=localStorage.getItem("token")

  return (
    <nav class="navbar navbar-expand-lg bg-success">
  <div class="container-fluid">
    <a class="navbar-brand text-light" href="/predicate">Welcome - {data}</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse " id="navbarNav">
      <ul class="navbar-nav d-flex align-items-center">
        <li class="nav-item">
          <a class="nav-link text-light" href="/signup">SignUp</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-light" href="/login">Login</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-light" href="/predicate">TruthTableGenerator</a>
        </li>
        {/* <li class="nav-item">
          <a class="nav-link text-light" href="/users">Users</a>
        </li> */}
        <li class="nav-item">
        <button class="nav-item mr nav-link p-2" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  </div>
</nav>
  );
};

export default Header;
