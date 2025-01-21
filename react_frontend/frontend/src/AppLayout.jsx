const AppLayout = ({ children }) => {
    return (
      <div className="pt-10 pb-10 bg-gray-100">
        {/* The `pt-16` and `pb-16` ensure enough padding for the navbar and footer */}
        {children}
      </div>
    );
  };
  
  export default AppLayout;