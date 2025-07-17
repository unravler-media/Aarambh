export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
  isFeatured: boolean;
}

import { categories } from "./categories";

export const posts: Post[] = [
  // Featured Posts
  {
    id: "1",
    title: "Building High-Performance Web Services with Go",
    slug: "high-performance-web-services-go",
    excerpt: "Learn how to leverage Go's concurrency model and lightweight goroutines to build scalable web services.",
    content: `
      # Building High-Performance Web Services with Go

      Go (or Golang) is designed for concurrency and scalability, making it an excellent choice for building high-performance web services.

      ## Concurrency with Goroutines

      Goroutines are lightweight threads that allow you to run functions concurrently. They use minimal resources, enabling thousands to run simultaneously.

      \`\`\`go
      func main() {
        // Start a goroutine
        go func() {
          fmt.Println("Processing in background")
        }()
        
        // Continue with other work
        fmt.Println("Main function continues")
      }
      \`\`\`

      ## The Power of Channels

      Channels provide a way for goroutines to communicate and synchronize:

      \`\`\`go
      func main() {
        ch := make(chan string)
        
        go func() {
          ch <- "Result from goroutine"
        }()
        
        result := <-ch
        fmt.Println(result)
      }
      \`\`\`

      ## Building a Simple Web Service

      \`\`\`go
      package main

      import (
        "encoding/json"
        "log"
        "net/http"
      )

      type Response struct {
        Message string \`json:"message"\`
        Status  int    \`json:"status"\`
      }

      func main() {
        http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
          response := Response{
            Message: "Hello, Gopher!",
            Status:  200,
          }
          
          w.Header().Set("Content-Type", "application/json")
          json.NewEncoder(w).Encode(response)
        })
        
        log.Println("Server starting on :8080")
        log.Fatal(http.ListenAndServe(":8080", nil))
      }
      \`\`\`

      ## Conclusion

      Go's simplicity, combined with powerful concurrency features, makes it an excellent choice for building scalable, high-performance web services.
    `,
    categoryId: "golang",
    coverImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1000",
    author: {
      name: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    publishedAt: "2023-12-15",
    readTime: 8,
    isFeatured: true
  },
  {
    id: "2",
    title: "Understanding Python's Asyncio: A Practical Guide",
    slug: "python-asyncio-practical-guide",
    excerpt: "Master Python's asyncio library for building concurrent applications with this comprehensive guide.",
    content: `
      # Understanding Python's Asyncio: A Practical Guide

      Python's asyncio library provides a framework for writing single-threaded concurrent code using coroutines.

      ## Coroutines vs. Threads

      Coroutines are computer program components that generalize subroutines for non-preemptive multitasking. Unlike threads, coroutines yield control cooperatively rather than through preemption.

      ## Basic Asyncio Concepts

      \`\`\`python
      import asyncio

      async def say_hello():
          print("Hello")
          await asyncio.sleep(1)
          print("World")

      async def main():
          await say_hello()
          
      asyncio.run(main())
      \`\`\`

      ## Working with Tasks

      Tasks are used to schedule coroutines concurrently:

      \`\`\`python
      import asyncio
      import time

      async def say_after(delay, what):
          await asyncio.sleep(delay)
          print(what)

      async def main():
          # Create tasks
          task1 = asyncio.create_task(
              say_after(1, 'hello'))
              
          task2 = asyncio.create_task(
              say_after(2, 'world'))
              
          print(f"started at {time.strftime('%X')}")
          
          # Wait for both tasks to complete
          await task1
          await task2
          
          print(f"finished at {time.strftime('%X')}")

      asyncio.run(main())
      \`\`\`

      ## Handling Multiple Tasks

      \`\`\`python
      async def main():
          tasks = [
              asyncio.create_task(some_task(1)),
              asyncio.create_task(some_task(2)),
              asyncio.create_task(some_task(3))
          ]
          
          # Wait for all tasks to complete
          results = await asyncio.gather(*tasks)
      \`\`\`

      ## Conclusion

      Asyncio provides powerful tools for concurrent programming while avoiding the complexity of threads and locks. It's particularly useful for I/O-bound applications where you're waiting for external resources.
    `,
    categoryId: "python",
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000",
    author: {
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    publishedAt: "2023-12-10",
    readTime: 12,
    isFeatured: true
  },
  {
    id: "3",
    title: "Django vs Flask: Choosing the Right Python Web Framework",
    slug: "django-vs-flask-comparison",
    excerpt: "Compare Django and Flask to determine which Python web framework is best suited for your specific project needs.",
    content: `
      # Django vs Flask: Choosing the Right Python Web Framework

      Python offers several excellent web frameworks, but Django and Flask stand out as the most popular. Let's compare their strengths and weaknesses.

      ## Django: The Batteries-Included Framework

      Django follows the "batteries-included" philosophy, providing a comprehensive set of features out of the box:

      - Built-in admin interface
      - ORM (Object-Relational Mapping)
      - Authentication system
      - Form handling
      - Template engine

      ### Sample Django View
      \`\`\`python
      from django.http import HttpResponse
      from django.views import View
      from .models import Article

      class ArticleListView(View):
          def get(self, request):
              articles = Article.objects.all()
              return render(request, 'articles/list.html', {'articles': articles})
      \`\`\`

      ## Flask: The Microframework

      Flask is a lightweight "microframework" that provides the essentials with the flexibility to choose your components:

      - Routing
      - Request/Response handling
      - Template rendering
      - Testing support

      ### Sample Flask Route
      \`\`\`python
      from flask import Flask, render_template
      from models import Article

      app = Flask(__name__)

      @app.route('/articles')
      def article_list():
          articles = Article.query.all()
          return render_template('articles/list.html', articles=articles)
      \`\`\`

      ## Making the Right Choice

      ### Choose Django if:
      - You're building a content-heavy site
      - You need built-in admin functionality
      - You want rapid development with all components integrated
      - Your project is large and likely to grow

      ### Choose Flask if:
      - You need more flexibility in your technology stack
      - You're building a smaller application or API
      - You want to choose your own components
      - You need a lighter footprint

      ## Conclusion

      Both frameworks are excellent choices with different philosophies. Django offers productivity and structure, while Flask provides simplicity and flexibility. Your specific project requirements should guide your decision.
    `,
    categoryId: "python",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
    author: {
      name: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    publishedAt: "2023-12-05",
    readTime: 10,
    isFeatured: true
  },
  {
    id: "4",
    title: "Reverse Engineering Android Applications: A Beginner's Guide",
    slug: "reverse-engineering-android-apps",
    excerpt: "Learn the fundamentals of Android app reverse engineering, including tools and methodologies for analyzing mobile applications.",
    content: `
      # Reverse Engineering Android Applications: A Beginner's Guide

      Reverse engineering Android applications can help security researchers understand how apps work, identify vulnerabilities, and learn from others' code.

      ## Understanding the APK Structure

      An Android Package (APK) consists of several components:

      - AndroidManifest.xml - Contains app permissions and components
      - classes.dex - Compiled code in Dalvik Executable format
      - resources.arsc - Compiled resources
      - res/ - Resource files
      - META-INF/ - Signatures and metadata

      ## Essential Tools

      ### 1. APK Extraction
      
      Use apktool to decompile the APK:

      \`\`\`bash
      apktool d application.apk -o output_directory
      \`\`\`

      ### 2. Decompiling DEX to Java

      Use jadx to convert DEX to Java source:

      \`\`\`bash
      jadx -d output_directory application.apk
      \`\`\`

      ### 3. Dynamic Analysis

      - Frida - For runtime instrumentation
      - Objection - For runtime exploration
      
      \`\`\`bash
      frida -U -f com.example.app -l script.js --no-pause
      \`\`\`

      ## Analyzing the AndroidManifest.xml

      The manifest reveals important information:

      \`\`\`xml
      <manifest xmlns:android="http://schemas.android.com/apk/res/android"
                package="com.example.app">
          <uses-permission android:name="android.permission.INTERNET" />
          <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
          
          <application
              android:allowBackup="true"
              android:icon="@mipmap/ic_launcher"
              android:label="@string/app_name">
              <!-- Activities, Services, etc. defined here -->
          </application>
      </manifest>
      \`\`\`

      ## Finding Security Vulnerabilities

      Common issues to look for:

      1. Hardcoded credentials
      2. Insecure data storage
      3. Unprotected components
      4. Weak cryptography
      5. Insecure network communication

      ## Ethical Considerations

      Always:
      - Respect intellectual property rights
      - Only reverse engineer apps you own or have permission to analyze
      - Report vulnerabilities responsibly
      - Check local laws regarding reverse engineering

      ## Conclusion

      Reverse engineering Android applications is a powerful skill for security research and learning. Always approach it ethically and legally while following responsible disclosure principles.
    `,
    categoryId: "reverse",
    coverImage: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1000",
    author: {
      name: "Raj Patel",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    publishedAt: "2023-11-28",
    readTime: 15,
    isFeatured: true
  },
  // Regular Posts
  {
    id: "5",
    title: "Writing Clean and Efficient Go Code",
    slug: "clean-efficient-go-code",
    excerpt: "Discover best practices for writing clean, maintainable, and efficient Go code in your projects.",
    content: `
      # Writing Clean and Efficient Go Code

      Go encourages a clean, straightforward coding style. This article explores best practices for writing idiomatic Go code.

      ## Code Organization

      Organize your code into packages based on functionality, not layer:

      \`\`\`
      project/
      ├── cmd/
      │   └── server/
      │       └── main.go
      ├── internal/
      │   ├── auth/
      │   ├── database/
      │   └── handler/
      └── pkg/
          └── logger/
      \`\`\`

      ## Error Handling

      In Go, errors are values and should be handled explicitly:

      \`\`\`go
      func ReadConfig(path string) ([]byte, error) {
          data, err := ioutil.ReadFile(path)
          if err != nil {
              return nil, fmt.Errorf("reading config file: %w", err)
          }
          return data, nil
      }
      \`\`\`

      ## Embrace Interfaces

      Interfaces in Go are satisfied implicitly and should be kept small:

      \`\`\`go
      type Reader interface {
          Read(p []byte) (n int, err error)
      }

      type Writer interface {
          Write(p []byte) (n int, err error)
      }
      \`\`\`

      ## Use Slices Efficiently

      Pre-allocate slices when you know the size:

      \`\`\`go
      // Less efficient
      var items []Item
      for i := 0; i < 1000; i++ {
          items = append(items, Item{})
      }

      // More efficient
      items := make([]Item, 0, 1000)
      for i := 0; i < 1000; i++ {
          items = append(items, Item{})
      }
      \`\`\`

      ## Concurrency Patterns

      Use channels for communication, not shared memory:

      \`\`\`go
      func worker(jobs <-chan Job, results chan<- Result) {
          for job := range jobs {
              results <- process(job)
          }
      }

      func main() {
          jobs := make(chan Job, 100)
          results := make(chan Result, 100)
          
          // Start workers
          for i := 0; i < 3; i++ {
              go worker(jobs, results)
          }
          
          // Send jobs and collect results
          // ...
      }
      \`\`\`

      ## Avoid Premature Optimization

      Write clear code first, then optimize based on profiling:

      \`\`\`go
      import "runtime/pprof"

      func main() {
          f, _ := os.Create("cpu.prof")
          defer f.Close()
          pprof.StartCPUProfile(f)
          defer pprof.StopCPUProfile()
          
          // Your program logic here
      }
      \`\`\`

      ## Conclusion

      Writing clean and efficient Go code involves understanding the language's philosophy: simplicity, readability, and explicitness. By following these principles, you'll create more maintainable and performant applications.
    `,
    categoryId: "golang",
    coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000",
    author: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    publishedAt: "2023-11-20",
    readTime: 9,
    isFeatured: false
  },
  {
    id: "6",
    title: "Understanding Python's Global Interpreter Lock (GIL)",
    slug: "python-gil-explained",
    excerpt: "Dive deep into Python's Global Interpreter Lock, understand its implications for concurrent programming, and learn workarounds.",
    content: `
      # Understanding Python's Global Interpreter Lock (GIL)

      The Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously. This article explores its implications and workarounds.

      ## What is the GIL?

      The GIL is a mechanism used in CPython (the reference implementation of Python) that ensures only one thread executes Python bytecode at a time. This simplifies memory management but limits multi-core performance.

      ## Why Does Python Have a GIL?

      Python uses reference counting for memory management:

      \`\`\`python
      a = []  # refcount for list is 1
      b = a   # refcount for list is 2
      del a   # refcount for list is 1
      del b   # refcount for list is 0, memory is freed
      \`\`\`

      Without the GIL, this system would require complex locking mechanisms to prevent race conditions.

      ## Impact on Threading Performance

      Consider this example:

      \`\`\`python
      import threading
      import time

      def cpu_bound_task():
          # Computationally intensive work
          for _ in range(10000000):
              _ = 1 + 1

      def run_threads(num_threads):
          threads = []
          start = time.time()
          
          for _ in range(num_threads):
              thread = threading.Thread(target=cpu_bound_task)
              thread.start()
              threads.append(thread)
              
          for thread in threads:
              thread.join()
              
          end = time.time()
          return end - start

      print(f"Single thread: {run_threads(1):.2f} seconds")
      print(f"Four threads: {run_threads(4):.2f} seconds")
      \`\`\`

      Even with multiple threads, CPU-bound operations don't get faster due to the GIL.

      ## Working Around the GIL

      ### 1. Multiprocessing

      The \`multiprocessing\` module bypasses the GIL by using separate processes:

      \`\`\`python
      import multiprocessing as mp

      def process_data(data):
          # CPU intensive processing
          return processed_result

      if __name__ == '__main__':
          with mp.Pool(processes=4) as pool:
              results = pool.map(process_data, data_chunks)
      \`\`\`

      ### 2. Use Alternative Implementations

      - PyPy offers better performance with its JIT compiler
      - Jython and IronPython don't have a GIL

      ### 3. Use C Extensions

      Release the GIL in CPU-bound C extensions:

      \`\`\`c
      #include <Python.h>

      static PyObject* cpu_intensive_function(PyObject* self) {
          Py_BEGIN_ALLOW_THREADS
          // CPU-intensive code here (GIL is released)
          Py_END_ALLOW_THREADS
          
          Py_RETURN_NONE;
      }
      \`\`\`

      ## Conclusion

      While the GIL presents challenges for CPU-bound multithreaded code, understanding its purpose and limitations helps in designing Python applications that can still achieve concurrency through alternate approaches.
    `,
    categoryId: "python",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000",
    author: {
      name: "Elena Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    publishedAt: "2023-11-15",
    readTime: 11,
    isFeatured: false
  },
  {
    id: "7",
    title: "Building a Malware Analysis Lab: Essential Tools and Best Practices",
    slug: "malware-analysis-lab-setup",
    excerpt: "Learn how to create a secure, isolated environment for analyzing malware samples with the right tools and safety measures.",
    content: `
      # Building a Malware Analysis Lab: Essential Tools and Best Practices

      A properly configured malware analysis lab is essential for securely examining malicious software. This article guides you through setting up a safe environment for malware research.

      ## Lab Architecture

      The ideal malware analysis lab consists of:

      1. Host system - Your everyday operating system
      2. Virtualization platform - Hypervisor for running virtual machines
      3. Analysis VMs - Isolated systems for examining malware
      4. Network simulation - Controlled network environment

      ## Virtualization Platform

      Popular options include:

      - VMware Workstation/Fusion
      - VirtualBox
      - KVM/QEMU

      Ensure your hypervisor settings prevent VM escape attacks:

      \`\`\`
      # VirtualBox example: Disable shared clipboard and drag-and-drop
      VBoxManage modifyvm "Malware-Analysis-VM" --clipboard-mode disabled
      VBoxManage modifyvm "Malware-Analysis-VM" --draganddrop disabled
      \`\`\`

      ## Network Configuration

      Create an isolated network:

      1. **Host-only network** - No internet access, communication only with host
      2. **Internal network** - VMs can communicate with each other, but not with host
      3. **Simulated internet** - Optional INetSim setup

      For INetSim on Ubuntu:

      \`\`\`bash
      apt-get install inetsim
      # Edit /etc/inetsim/inetsim.conf
      # Set service_bind_address to your host-only interface IP
      \`\`\`

      ## Essential Analysis Tools

      ### Static Analysis Tools
      
      - **Strings** - Extract text strings
      - **PEiD/DIE** - Detect packers/compilers
      - **PEStudio** - Analyze PE headers
      - **PPEE** - PE file examination
      
      ### Dynamic Analysis Tools
      
      - **Process Monitor** - Track system activity
      - **Wireshark** - Monitor network traffic
      - **Regshot** - Detect registry changes
      - **API Monitor** - Track API calls

      ### Automated Analysis
      
      - **Cuckoo Sandbox** - Automated malware analysis

      \`\`\`bash
      # Basic Cuckoo setup
      pip install -U cuckoo
      cuckoo init
      cuckoo community
      \`\`\`

      ## Security Best Practices

      1. **Snapshots** - Create VM snapshots before analyzing each sample
      2. **Air-gap consideration** - For high-risk samples, use physically isolated hardware
      3. **Permission restrictions** - Run analysis as a non-admin user when possible
      4. **Data backup** - Keep important analysis results backed up securely
      5. **Network monitoring** - Always capture and analyze all traffic

      ## Analysis Workflow

      1. Generate file hashes and check against VirusTotal
      2. Perform initial static analysis (strings, headers, etc.)
      3. Execute malware in controlled environment
      4. Analyze behavioral indicators
      5. Document findings

      ## Conclusion

      A well-designed malware analysis lab balances security with functionality. By following these guidelines, you can safely analyze malicious software while minimizing risks to your main systems and network.
    `,
    categoryId: "malware",
    coverImage: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=1000",
    author: {
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/64.jpg"
    },
    publishedAt: "2023-11-10",
    readTime: 13,
    isFeatured: false
  },
  {
    id: "8",
    title: "Flask RESTful API Development: Best Practices and Patterns",
    slug: "flask-restful-api-best-practices",
    excerpt: "Master Flask RESTful API development with these industry-standard practices, patterns, and code examples.",
    content: `
      # Flask RESTful API Development: Best Practices and Patterns

      This guide explores best practices and patterns for building robust, scalable REST APIs with Flask and its extensions.

      ## Project Structure

      A well-organized project structure helps maintain your code as it grows:

      \`\`\`
      my_api/
      ├── app/
      │   ├── __init__.py       # Application factory
      │   ├── models/           # Database models
      │   ├── resources/        # API resources/views
      │   ├── schemas/          # Serialization schemas
      │   └── extensions.py     # Flask extensions
      ├── migrations/           # Database migrations
      ├── tests/                # Test suite
      ├── config.py             # Configuration
      └── wsgi.py               # App entry point
      \`\`\`

      ## Application Factory Pattern

      Create a flexible application factory:

      \`\`\`python
      # app/__init__.py
      from flask import Flask

      def create_app(config_name="default"):
          app = Flask(__name__)
          
          # Load configuration
          from config import config_dict
          app.config.from_object(config_dict[config_name])
          
          # Initialize extensions
          from app.extensions import db, migrate, jwt
          db.init_app(app)
          migrate.init_app(app, db)
          jwt.init_app(app)
          
          # Register blueprints
          from app.resources import api_bp
          app.register_blueprint(api_bp, url_prefix='/api/v1')
          
          return app
      \`\`\`

      ## Resource-Based API Design

      Use Flask-RESTful for resource-based endpoint design:

      \`\`\`python
      # app/resources/user.py
      from flask_restful import Resource, reqparse
      from app.models import UserModel
      from app.schemas import UserSchema
      from app.extensions import db

      user_schema = UserSchema()
      users_schema = UserSchema(many=True)

      class UserResource(Resource):
          def get(self, user_id):
              user = UserModel.query.get_or_404(user_id)
              return user_schema.dump(user)
              
          def put(self, user_id):
              user = UserModel.query.get_or_404(user_id)
              
              parser = reqparse.RequestParser()
              parser.add_argument('username', type=str)
              parser.add_argument('email', type=str)
              args = parser.parse_args()
              
              if args['username']:
                  user.username = args['username']
              if args['email']:
                  user.email = args['email']
                  
              db.session.commit()
              
              return user_schema.dump(user)
              
          def delete(self, user_id):
              user = UserModel.query.get_or_404(user_id)
              db.session.delete(user)
              db.session.commit()
              
              return '', 204
      \`\`\`

      ## Request Validation and Serialization

      Use Marshmallow for validation and serialization:

      \`\`\`python
      # app/schemas.py
      from marshmallow import Schema, fields, validate

      class UserSchema(Schema):
          id = fields.Int(dump_only=True)
          username = fields.Str(required=True, validate=[
              validate.Length(min=3, max=50)
          ])
          email = fields.Email(required=True)
          created_at = fields.DateTime(dump_only=True)
          
          class Meta:
              ordered = True
      \`\`\`

      ## Authentication with JWT

      Implement JWT authentication:

      \`\`\`python
      # app/resources/auth.py
      from flask_restful import Resource, reqparse
      from flask_jwt_extended import create_access_token
      from app.models import UserModel

      class TokenResource(Resource):
          def post(self):
              parser = reqparse.RequestParser()
              parser.add_argument('username', required=True, help='Username cannot be blank')
              parser.add_argument('password', required=True, help='Password cannot be blank')
              args = parser.parse_args()
              
              user = UserModel.query.filter_by(username=args['username']).first()
              
              if user and user.check_password(args['password']):
                  access_token = create_access_token(identity=user.id)
                  return {'access_token': access_token}, 200
                  
              return {'message': 'Invalid credentials'}, 401
      \`\`\`

      ## Error Handling

      Create consistent error responses:

      \`\`\`python
      # app/extensions.py
      from werkzeug.exceptions import HTTPException
      from flask import jsonify

      def register_error_handlers(app):
          @app.errorhandler(HTTPException)
          def handle_http_error(error):
              response = jsonify({
                  'error': error.name,
                  'message': error.description,
              })
              response.status_code = error.code
              return response
              
          @app.errorhandler(Exception)
          def handle_generic_error(error):
              response = jsonify({
                  'error': 'Internal Server Error',
                  'message': str(error),
              })
              response.status_code = 500
              return response
      \`\`\`

      ## Documentation

      Document your API with Flask-RESTX or Swagger:

      \`\`\`python
      # app/extensions.py
      from flask_restx import Api

      api = Api(
          title="My API",
          version="1.0",
          description="A description of my API",
          doc="/docs"
      )

      # In your resource file:
      @api.route('/users/<int:user_id>')
      @api.doc(params={'user_id': 'The user ID'})
      class UserResource(Resource):
          @api.response(200, 'Success')
          @api.response(404, 'User not found')
          def get(self, user_id):
              # Your implementation
              pass
      \`\`\`

      ## Conclusion

      By following these best practices and patterns, you can build Flask RESTful APIs that are maintainable, scalable, and easy to document. Consider using extensions like Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, and Flask-JWT-Extended to accelerate your development process.
    `,
    categoryId: "python",
    coverImage: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1000",
    author: {
      name: "Lisa Park",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg"
    },
    publishedAt: "2023-11-05",
    readTime: 14,
    isFeatured: false
  }
];

export const getPostsByCategory = (categoryId: string) => {
  return posts.filter(post => post.categoryId === categoryId);
};

export const getFeaturedPosts = () => {
  return posts.filter(post => post.isFeatured);
};

export const getPostBySlug = (slug: string) => {
  return posts.find(post => post.slug === slug);
};

export const getCategoryNameById = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Uncategorized';
};
